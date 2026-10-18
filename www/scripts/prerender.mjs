// After `vite build` and `vite build --ssr`: write one static HTML page per route into dist/.
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://uixdesign.pagestro.com/ui";
const { render, allPaths, chunkOf, preloadAll } = await import(pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href);
await preloadAll(); // every page chunk, so renderToString never meets an unloaded page
const manifest = JSON.parse(await readFile(join(dist, ".vite", "manifest.json"), "utf8"));
/** The page's chunk and the shared chunks it imports (the entry is already in the template). */
const preloads = (path, seen = new Set()) => { const walk = key => { const m = manifest[key]; if (!m || seen.has(m.file) || m.isEntry) return; seen.add(m.file); (m.imports || []).forEach(walk); }; walk(chunkOf(path)); return [...seen]; };
const template = await readFile(join(dist, "index.html"), "utf8");
const esc = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function page(path) {
  const { html, title, description } = render(path);
  const canonical = SITE + (path === "/" ? "" : path);
  let out = template
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)
    .replace(/<title>.*?<\/title>/, () => `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, (_, a) => `${a}${esc(description)}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, (_, a) => `${a}${canonical}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, (_, a) => `${a}${esc(title)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, (_, a) => `${a}${esc(description)}"`);
  // The default theme's CSS is in the first paint instead of arriving after hydration.
  const pre = preloads(path).map(f => `    <link rel="modulepreload" crossorigin href="/ui/${f}" />\n`).join("");
  return out.replace("</head>", `    <link rel="stylesheet" href="/ui/themes/uix.css" />\n${pre}  </head>`);
}
const write = async (file, body) => { await mkdir(dirname(file), { recursive: true }); await writeFile(file, body); };

const paths = allPaths();
for (const p of paths) await write(p === "/" ? join(dist, "index.html") : join(dist, p, "index.html"), page(p));
await write(join(dist, "404.html"), page("/this-page-does-not-exist").replace(/<link rel="canonical"[^>]*>/, '<meta name="robots" content="noindex" />'));
await write(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p => `  <url><loc>${SITE}${p === "/" ? "/" : p}</loc></url>`).join("\n")}\n</urlset>\n`);
await rm(join(dist, ".vite"), { recursive: true, force: true });
// The registry the CLI and shadcn read: /ui/r/<item>.json and the /ui/registry.json index (see packages/cli DEFAULT_REGISTRY).
await cp(join(root, "..", "registry", "r"), join(dist, "r"), { recursive: true });
await cp(join(root, "..", "registry", "registry.json"), join(dist, "registry.json"));
console.log(`prerendered ${paths.length} pages + 404.html + sitemap.xml`);
