/**
 * Builds the public registry and @uix-ui/tailwind from UIX's generators (src/core in the UIX repo).
 * No component code lives in this repo: change src/core/codegen-react*.ts, then run `npm run build`.
 *
 *   UIX_CORE     path to the UIX repo's src/core       (default ../UIX Design System V1/src/core)
 *   UIX_PRESETS  path to uix-library/dist/registry     (default ../uix-library/dist/registry)
 *   UIX_PRO_OUT  where the private Pro registry goes   (default ../uix-website/site/public/_pro/ui-r, served only
 *                through the Worker's licence check; never inside this public repo). Skipped when uix-library has
 *                no dist/private (the Pro presets).
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CORE = resolve(process.env.UIX_CORE ?? join(root, '../UIX Design System V1/src/core'));
const PRESETS = resolve(process.env.UIX_PRESETS ?? join(root, '../uix-library/dist/registry'));
const core = (m: string) => import(pathToFileURL(join(CORE, m + '.ts')).href);

const { defaultConfig } = await core('defaults');
const { toReact, globalsCss, REACT_COMPONENT_IDS } = await core('codegen-react');
const { COMPONENT_CATEGORIES, VISUAL_STYLES } = await core('components');
const { importTokens } = await core('importers');

const NS = '@uix';
// Free, MIT: every component except the marketing blocks (those are Pro, served by the private registry).
const PRO_CATEGORIES = ['marketing'];
const proIds = new Set(COMPONENT_CATEGORIES.filter((c: any) => PRO_CATEGORIES.includes(c.id)).flatMap((c: any) => c.items));
const freeIds = REACT_COMPONENT_IDS.filter((id: string) => !proIds.has(id));

const json = (o: unknown) => JSON.stringify(o, null, 2) + '\n';

function configFor(preset?: { id: string; name: string }, dir = PRESETS) {
  const c = defaultConfig();
  c.meta.name = preset?.name ?? 'UIX';
  c.components.selected = freeIds;
  if (preset) importTokens(readFileSync(join(dir, 'presets', preset.id, 'tokens.dtcg.json'), 'utf8'), c, { fileName: `${preset.id}.tokens.json` }).apply(c);
  return c;
}

/** A theme item: the Tailwind v4 theme + base layer + motion of toReact, without its own `@import "tailwindcss"` (the app has one). */
function themeItem(name: string, title: string, c: any) {
  const css = globalsCss(c, { standalone: false });
  const fonts = [...new Set(Object.values(c.typography.fonts) as string[])];
  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json', name, type: 'registry:style', title,
    description: `${title}: colours (light + dark), type scale, spacing, radius and shadows as a Tailwind v4 theme.`,
    dependencies: [], registryDependencies: [],
    files: [{ path: 'styles/uix.css', type: 'registry:file', target: '~/src/styles/uix.css', content: css }],
    meta: { fonts },
  };
}

// ---- components, utils, icons (one source: the default UIX config)
const base = configFor();
const out = toReact(base);
const items: any[] = out.filter((f: any) => /^registry\/[^/]+\.json$/.test(f.name)).map((f: any) => JSON.parse(f.content))
  .filter((it: any) => it.name !== 'theme' && it.name !== 'skins') // themes are built per preset below; visual styles are Pro
  .map((it: any) => ({ ...it, registryDependencies: it.registryDependencies.map((d: string) => `${NS}/${d}`) }));

// ---- themes: the UIX default + every free preset
const index = JSON.parse(readFileSync(join(PRESETS, 'index.json'), 'utf8'));
const free = index.presets.filter((p: any) => p.tier === 'free');
const themes = [themeItem('theme', 'UIX theme', base)];
for (const p of free) themes.push(themeItem(`theme-${p.id}`, `${p.name} theme`, configFor(p)));

// ---- write registry/
const reg = join(root, 'registry');
rmSync(reg, { recursive: true, force: true });
mkdirSync(join(reg, 'r'), { recursive: true });
for (const it of [...items, ...themes]) writeFileSync(join(reg, 'r', `${it.name}.json`), json(it));
writeFileSync(join(reg, 'registry.json'), json({
  $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'uix', homepage: 'https://uixdesign.pagestro.com/ui',
  items: [...items, ...themes].map(({ $schema, files, ...rest }) => ({ ...rest, files: files.map(({ content, ...f }: any) => f) })),
}));

// ---- write packages/tailwind/ (the same themes as npm CSS: @import "@uix-ui/tailwind/themes/<id>.css")
const tw = join(root, 'packages/tailwind');
rmSync(join(tw, 'themes'), { recursive: true, force: true });
mkdirSync(join(tw, 'themes'), { recursive: true });
for (const t of themes) writeFileSync(join(tw, 'themes', `${t.name === 'theme' ? 'uix' : t.name.slice(6)}.css`), t.files[0].content);
writeFileSync(join(tw, 'uix.css'), '/* Default UIX theme. Other themes: @import "@uix-ui/tailwind/themes/<preset>.css"; */\n@import "./themes/uix.css";\n');

const missing = free.filter((p: any) => !existsSync(join(tw, 'themes', `${p.id}.css`)));
if (missing.length) throw new Error(`themes missing: ${missing.map((p: any) => p.id).join(', ')}`);
console.log(`registry: ${items.length} items (${freeIds.length} components) + ${themes.length} themes · Pro components held back: ${[...proIds].join(', ')}`);

// ---- Pro (private): the Pro themes, the marketing blocks and the visual styles, for `@uix-pro/<name>`
const PRIVATE = resolve(PRESETS, '../private');
const PRO_OUT = resolve(process.env.UIX_PRO_OUT ?? join(root, '../uix-website/site/public/_pro/ui-r'));
if (existsSync(join(PRIVATE, 'presets'))) {
  const all = defaultConfig();
  all.components.selected = REACT_COMPONENT_IDS;
  all.components.styles = Object.keys(VISUAL_STYLES); // every visual style in skins.css (the free build has Modern only)
  const proNames = new Set<string>();
  const proItems = toReact(all).filter((f: any) => /^registry\/[^/]+\.json$/.test(f.name)).map((f: any) => JSON.parse(f.content))
    .filter((it: any) => it.name === 'skins' || !items.some((x: any) => x.name === it.name) && it.name !== 'theme');
  proItems.forEach((it: any) => proNames.add(it.name));
  for (const it of proItems) it.registryDependencies = it.registryDependencies.map((d: string) => `${proNames.has(d) ? '@uix-pro' : NS}/${d}`);
  const proThemes = index.presets.filter((p: any) => p.tier === 'pro').map((p: any) => themeItem(`theme-${p.id}`, `${p.name} theme`, configFor(p, PRIVATE)));
  rmSync(PRO_OUT, { recursive: true, force: true });
  mkdirSync(PRO_OUT, { recursive: true });
  for (const it of [...proItems, ...proThemes]) writeFileSync(join(PRO_OUT, `${it.name}.json`), json(it));
  // The index is public (names only, like the presets page); the items need a key.
  writeFileSync(join(PRO_OUT, 'registry.json'), json({
    $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'uix-pro', homepage: 'https://uixdesign.pagestro.com/pricing',
    items: [...proItems, ...proThemes].map(({ $schema, files, ...rest }) => ({ ...rest, files: files.map(({ content, ...f }: any) => f) })),
  }));
  console.log(`pro registry → ${PRO_OUT}: ${proItems.length} items (${proItems.map((i: any) => i.name).join(', ')}) + ${proThemes.length} themes`);
}
