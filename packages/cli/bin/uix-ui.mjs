#!/usr/bin/env node
// uix-ui: add UIX components and themes to a React + Tailwind v4 app. No dependencies.
// Reads the same registry as the shadcn CLI (components.json → registries), so `npx shadcn add @uix/button` works too.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const DEFAULT_REGISTRY = 'https://uixdesign.pagestro.com/ui/r';
const HELP = `uix-ui: UIX components and themes for React + Tailwind v4

  npx uix-ui init [--preset <id>] [--registry <url|folder>]   set up the theme, utils and components.json
  npx uix-ui add <component...>                               copy components into your app
  npx uix-ui theme <preset>                                   switch to another UIX preset (uix = default)
  npx uix-ui list                                             components and themes in the registry

  --overwrite     replace files that already exist (add)
  --no-install    don't run the package manager, just print the command
  UIX Pro: set UIX_LICENSE=<your key>, then add Pro items by name (hero, pricing-card, skins…) or switch to a
  Pro theme (npx uix-ui theme acid-prompt). \`list\` shows them all.`;

const cwd = process.cwd();
const argv = process.argv.slice(2);
const flag = (n, bool = false) => {
  const i = argv.indexOf(`--${n}`);
  if (i < 0) return undefined;
  const v = argv[i + 1], takes = !bool && v && !v.startsWith('--');
  argv.splice(i, takes ? 2 : 1);
  return takes ? v : true;
};
const opts = { preset: flag('preset'), registry: flag('registry'), overwrite: flag('overwrite', true), noInstall: flag('no-install', true) };
const [cmd, ...names] = argv;

const say = (s) => console.log(s);
const die = (s) => { console.error(`uix-ui: ${s}`); process.exit(1); };
const readJson = (f) => JSON.parse(readFileSync(join(cwd, f), 'utf8'));
const write = (file, content) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, content); };
const rel = (from, to) => { const r = relative(dirname(from), to).split(sep).join('/'); return r.startsWith('.') ? r : `./${r}`; };

// `@` is the src folder when there is one (Vite, Next with src/), else the project root, as in shadcn's defaults.
const srcRoot = existsSync(join(cwd, 'src')) ? join(cwd, 'src') : cwd;
const aliasPath = (a) => join(srcRoot, a.replace(/^@\//, ''));

function config() {
  if (!existsSync(join(cwd, 'components.json'))) die('no components.json here. Run `npx uix-ui init` first.');
  return readJson('components.json');
}

/** `@uix/button` → its registry entry (string or { url, headers } with ${ENV} values, the shadcn format). */
function source(cfg, name) {
  const [ns, item] = name.startsWith('@') ? [name.slice(0, name.indexOf('/')), name.slice(name.indexOf('/') + 1)] : ['@uix', name];
  const reg = cfg.registries?.[ns];
  if (!reg) die(`no registry "${ns}" in components.json.`);
  const { url, headers = {} } = typeof reg === 'string' ? { url: reg } : reg;
  const env = (s) => s.replace(/\$\{(\w+)\}/g, (_, k) => process.env[k] ?? '');
  return { ns, item, url: url.replace('{name}', item), headers: Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, env(v)])) };
}

const PRICING = 'https://uixdesign.pagestro.com/pricing';
const missing = (src) => Object.assign(new Error(`"${src.item}" is not in the registry (${src.url}).`), { missing: true });

async function load(src) {
  if (!/^https?:/.test(src.url)) {
    if (!existsSync(src.url)) throw missing(src);
    return JSON.parse(readFileSync(src.url, 'utf8'));
  }
  const res = await fetch(src.url, { headers: src.headers });
  if (res.status === 401) die(process.env.UIX_LICENSE ? `UIX_LICENSE is set, but that key wasn't found. Check it in your UIX account (${PRICING}).` : `${src.item.startsWith('theme-') ? `The "${src.item.slice(6)}" theme` : `"${src.item}"`} is part of UIX Pro. Set UIX_LICENSE to your key (${PRICING}).`);
  if (res.status === 403) die(`"${src.item}" needs an active UIX Pro licence; this key's plan has ended (${PRICING}).`);
  if (res.status === 404) throw missing(src);
  if (!res.ok) die(`"${src.item}" could not be loaded (${res.status} from ${src.url}).`);
  return res.json();
}

/** The Pro index (names only, no key needed), or null when there is no Pro registry. */
let proIndex;
async function loadProIndex(cfg) {
  if (proIndex !== undefined) return proIndex;
  if (!cfg.registries?.['@uix-pro']) return (proIndex = null);
  const ps = source(cfg, '@uix-pro/x');
  return (proIndex = await load({ ...ps, item: 'registry.json', url: ps.url.replace(/\/x\.json$/, '/registry.json'), headers: {} }).catch(() => null));
}

/** A bare name that the free registry doesn't have is looked up in Pro (`hero` → `@uix-pro/hero`). */
async function loadAny(cfg, src) {
  try { return { src, it: await load(src) }; } catch (e) {
    if (!e.missing || src.ns !== '@uix') throw e;
    const index = await loadProIndex(cfg);
    if (!index?.items.some(i => i.name === src.item)) throw Object.assign(new Error(`"${src.item.replace(/^theme-/, '')}" is not a uix-ui component or theme. See the list: npx uix-ui list`), { missing: true });
    const pro = source(cfg, `@uix-pro/${src.item}`);
    return { src: pro, it: await load(pro) };
  }
}

/** Loads the items and everything they depend on, dependencies first. */
async function resolveAll(cfg, list) {
  const seen = new Map();
  const visit = async (name) => {
    let src = source(cfg, name);
    const key = `${src.ns}/${src.item}`;
    if (seen.has(key)) return;
    seen.set(key, null);
    const bare = !name.startsWith('@');
    const got = bare ? await loadAny(cfg, src) : { src, it: await load(src) };
    const it = got.it;
    if (got.src !== src) { seen.delete(key); src = got.src; seen.set(`${src.ns}/${src.item}`, null); }
    for (const d of it.registryDependencies ?? []) await visit(d.startsWith('@') ? d : `${src.ns}/${d}`);
    seen.delete(`${src.ns}/${src.item}`); seen.set(`${src.ns}/${src.item}`, it);
  };
  for (const n of list) await visit(n);
  return [...seen.values()];
}

function target(cfg, f) {
  const base = f.path.split('/').pop();
  if (f.type === 'registry:ui') return join(aliasPath(cfg.aliases.ui), base);
  if (f.type === 'registry:lib') return join(aliasPath(cfg.aliases.lib), base);
  if (f.type === 'registry:hook') return join(aliasPath(cfg.aliases.hooks ?? '@/hooks'), base);
  return join(srcRoot, f.path); // registry:file, e.g. styles/uix.css
}

/** Writes the files; `@/…` imports become relative paths, so no path alias is needed. */
function place(cfg, items, overwrite) {
  for (const it of items) for (const f of it.files) {
    const file = target(cfg, f);
    const code = f.content.replace(/(["'])@\/([^"']+)\1/g, (_, q, p) => {
      const to = p.startsWith('lib/') ? join(aliasPath(cfg.aliases.lib), p.slice(4)) : p.startsWith('components/ui/') ? join(aliasPath(cfg.aliases.ui), p.slice(14)) : join(srcRoot, p);
      return q + rel(file, to) + q;
    });
    const shown = relative(cwd, file);
    if (existsSync(file) && !overwrite) { if (readFileSync(file, 'utf8') !== code) say(`  skipped ${shown} (exists, use --overwrite)`); continue; }
    write(file, code);
    say(`  wrote   ${shown}`);
  }
  for (const it of items) for (const f of it.files) if (/\.css$/.test(f.path) && !/(^|\/)uix\.css$/.test(f.path)) importCss(cfg, target(cfg, f));
}

/** Adds `@import "<file>";` to the app's main CSS, after the theme import (visual styles, backdrops). */
function importCss(cfg, file) {
  const cssFile = join(cwd, cfg.tailwind?.css ?? 'src/index.css');
  if (!existsSync(cssFile)) return;
  let src = readFileSync(cssFile, 'utf8');
  const imp = `@import "${rel(cssFile, file)}";`;
  if (src.includes(imp)) return;
  const last = [...src.matchAll(/@import [^;\n]+;?/g)].pop();   // after the theme and any earlier style sheets
  src = last ? src.slice(0, last.index + last[0].length) + `\n${imp}` + src.slice(last.index + last[0].length) : `${imp}\n${src}`;
  write(cssFile, src);
  say(`  updated ${relative(cwd, cssFile)}`);
}

function install(items) {
  const deps = [...new Set(items.flatMap(i => i.dependencies ?? []))];
  const pkg = existsSync(join(cwd, 'package.json')) ? readJson('package.json') : {};
  const have = { ...pkg.dependencies, ...pkg.devDependencies };
  const need = deps.filter(d => !have[d]);
  if (!need.length) return;
  const pm = existsSync(join(cwd, 'pnpm-lock.yaml')) ? 'pnpm' : existsSync(join(cwd, 'yarn.lock')) ? 'yarn' : existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock')) ? 'bun' : 'npm';
  const args = [pm === 'npm' ? 'install' : 'add', ...need];
  if (opts.noInstall) return say(`\nInstall: ${pm} ${args.join(' ')}`);
  say(`\n${pm} ${args.join(' ')}`);
  if (spawnSync(pm, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' }).status) die('install failed.');
}

/** Google Fonts links for the theme's fonts, between markers in index.html (Vite). Other setups get the links printed. */
function fonts(list = []) {
  const links = list.map(f => `    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap" />`);
  const html = join(cwd, 'index.html');
  if (!existsSync(html)) return list.length && say(`\nLoad the theme's fonts (${list.join(', ')}), e.g.:\n${links.join('\n')}`);
  const block = `<!-- uix-fonts -->\n    <link rel="preconnect" href="https://fonts.googleapis.com" />\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n${links.join('\n')}\n    <!-- /uix-fonts -->`;
  let src = readFileSync(html, 'utf8');
  src = /<!-- uix-fonts -->[\s\S]*?<!-- \/uix-fonts -->/.test(src) ? src.replace(/<!-- uix-fonts -->[\s\S]*?<!-- \/uix-fonts -->/, block) : src.replace(/\s*<\/head>/, `\n    ${block}\n  </head>`);
  writeFileSync(html, src);
  say(`  fonts   ${list.join(', ')} → index.html`);
}

const themeName = (p) => (!p || p === true || p === 'uix' ? 'theme' : `theme-${p}`);

async function applyTheme(cfg, preset) {
  const [it] = await resolveAll(cfg, [themeName(preset)]);
  place(cfg, [it], true);
  fonts(it.meta?.fonts);
}

async function init() {
  if (!existsSync(join(cwd, 'package.json'))) die('run this in your app folder (no package.json here).');
  const pkg = readJson('package.json');
  const tw = { ...pkg.dependencies, ...pkg.devDependencies }.tailwindcss;
  if (!tw) say('Note: Tailwind CSS v4 is not installed yet (https://tailwindcss.com/docs/installation).');
  else if (/^[\^~]?3/.test(tw)) die('UIX themes need Tailwind CSS v4 (found v3).');

  const css = ['src/index.css', 'src/app/globals.css', 'app/globals.css', 'src/styles/globals.css', 'src/styles/global.css', 'src/main.css', 'app/app.css', 'app/tailwind.css'].find(f => existsSync(join(cwd, f))) ?? 'src/index.css';
  const local = opts.registry && !/^https?:/.test(opts.registry);
  const registry = opts.registry ? (local ? resolve(cwd, opts.registry) : opts.registry).replace(/\/$/, '') : DEFAULT_REGISTRY;
  const cfg = existsSync(join(cwd, 'components.json')) ? readJson('components.json') : {
    $schema: 'https://ui.shadcn.com/schema.json', style: 'new-york', rsc: existsSync(join(cwd, 'next.config.js')) || existsSync(join(cwd, 'next.config.mjs')) || existsSync(join(cwd, 'next.config.ts')), tsx: true,
    tailwind: { config: '', css, baseColor: 'neutral', cssVariables: true, prefix: '' },
    aliases: { components: '@/components', utils: '@/lib/utils', ui: '@/components/ui', lib: '@/lib', hooks: '@/hooks' },
    iconLibrary: 'lucide',
  };
  cfg.registries = {
    ...cfg.registries,
    '@uix': `${registry}/{name}.json`,
    '@uix-pro': { url: `${registry.replace(/\/r$/, '/r/pro')}/{name}.json`, headers: { Authorization: 'Bearer ${UIX_LICENSE}' } },
  };
  write(join(cwd, 'components.json'), JSON.stringify(cfg, null, 2) + '\n');
  say('  wrote   components.json');

  await applyTheme(cfg, opts.preset);
  const cssFile = join(cwd, cfg.tailwind.css);
  let src = existsSync(cssFile) ? readFileSync(cssFile, 'utf8') : '@import "tailwindcss";\n';
  const imp = `@import "${rel(cssFile, join(srcRoot, 'styles/uix.css'))}";`;
  if (!src.includes(imp)) {
    src = /@import ["']tailwindcss["'];?/.test(src) ? src.replace(/(@import ["']tailwindcss["'];?)/, `$1\n${imp}`) : `@import "tailwindcss";\n${imp}\n${src}`;
    write(cssFile, src);
    say(`  updated ${cfg.tailwind.css}`);
  }
  const items = await resolveAll(cfg, ['utils']);
  place(cfg, items, false);
  install(items);
  say(`\nDone. Next: npx uix-ui add button card input\nDark mode: <html data-theme="dark">. Other presets: npx uix-ui theme <preset>.`);
}

async function main() {
  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') return say(HELP);
  if (cmd === 'init') return init();
  const cfg = config();
  if (cmd === 'add') {
    if (!names.length) die('name at least one component, e.g. `npx uix-ui add button`.');
    const items = await resolveAll(cfg, names);
    place(cfg, items, !!opts.overwrite);
    return install(items);
  }
  if (cmd === 'theme') return applyTheme(cfg, names[0] ?? opts.preset);
  if (cmd === 'list') {
    const src = source(cfg, 'x');
    const index = await load({ ...src, item: 'registry.json', url: src.url.replace(/\/r\/x\.json$/, '/registry.json') });
    const comps = index.items.filter(i => i.type === 'registry:ui' && i.name !== 'icons').map(i => i.name);
    const themes = index.items.filter(i => i.name.startsWith('theme')).map(i => i.name === 'theme' ? 'uix' : i.name.slice(6));
    say(`Components (${comps.length}): ${comps.join(', ')}\n\nThemes (${themes.length}): ${themes.join(', ')}`);
    const pro = await loadProIndex(cfg);
    if (!pro) return;
    const blocks = pro.items.filter(i => !i.name.startsWith('theme-')).map(i => i.name);
    const proThemes = pro.items.filter(i => i.name.startsWith('theme-')).map(i => i.name.slice(6));
    return say(`\nUIX Pro, with UIX_LICENSE (${PRICING}):\n  Blocks and styles (${blocks.length}): ${blocks.join(', ')}\n  Themes (${proThemes.length}): ${proThemes.join(', ')}`);
  }
  die(`unknown command "${cmd}".\n\n${HELP}`);
}

main().catch(e => die(e.message));
