// Turns each @uix-ui/tailwind theme into CSS scoped to [data-preset="<id>"], so the landing can show every
// theme live on one page and switch without a rebuild. Also writes src/presets.json (names, fonts, swatches).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const www = join(dirname(fileURLToPath(import.meta.url)), '..');
const themes = join(www, '../packages/tailwind/themes');
const index = JSON.parse(readFileSync(process.env.UIX_PRESETS_INDEX ?? join(www, '../../uix-library/dist/registry/index.json'), 'utf8'));

/** Top-level `selector { body }` blocks (one level of nesting, as the generated themes have). */
function blocks(css) {
  const out = [];
  let i = 0;
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const head = css.slice(i, open).trim().split(';').pop().trim();
    let depth = 1, j = open + 1;
    while (depth && j < css.length) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++; }
    out.push({ head, body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}
const decls = (body) => body.split(';').map(s => s.trim()).filter(s => s.startsWith('--')).map(s => `  ${s};`).join('\n');

function scope(id, css) {
  const sel = `[data-preset="${id}"]`;
  const dark = `[data-theme="dark"] ${sel}, ${sel}[data-theme="dark"]`;
  const out = [];
  for (const b of blocks(css)) {
    if (b.head === '@theme' || b.head === ':root') out.push(`${sel} {\n${decls(b.body)}\n}`);
    else if (b.head.includes('[data-theme="dark"]')) out.push(`${dark} {\n${decls(b.body)}\n}`);
    else if (b.head.startsWith('@media (max-width')) {
      const inner = blocks(b.body).find(x => x.head === ':root');
      if (inner) out.push(`${b.head} {\n${sel} {\n${decls(inner.body)}\n}\n}`);
    }
  }
  out.push(`${sel} { font-family: var(--font-body); color: var(--text-primary); }`);
  return out.join('\n\n') + '\n';
}

mkdirSync(join(www, 'public/themes'), { recursive: true });
const ids = readdirSync(themes).filter(f => f.endsWith('.css')).map(f => f.slice(0, -4));
for (const id of ids) writeFileSync(join(www, 'public/themes', `${id}.css`), scope(id, readFileSync(join(themes, `${id}.css`), 'utf8')));

const pick = (p) => ({ id: p.id, name: p.name, summary: p.summary, fonts: p.fonts, radius: p.radius, light: p.swatches.light, dark: p.swatches.dark, moods: p.tags.moods.slice(0, 2), industries: p.tags.industries.slice(0, 3) });
const free = index.presets.filter(p => p.tier === 'free' && ids.includes(p.id)).map(pick);
// Pro presets appear only as their public swatches (index.json is public); their tokens never ship here.
const pro = index.presets.filter(p => p.tier === 'pro').map(p => ({ id: p.id, name: p.name, primary: p.swatches.light.primary, accent: p.swatches.light.accent, bg: p.swatches.light.background }));
writeFileSync(join(www, 'src/presets.json'), JSON.stringify({ free, pro, counts: { all: index.presets.length, free: free.length, pro: pro.length } }) + '\n');
console.log(`themes: ${ids.length} scoped · presets.json: ${free.length} free, ${pro.length} pro`);
