// Also copies each demo in src/examples/*.tsx into src/examples/code.json (import lines + the function), so the code shown
// on a page is exactly the demo's own source.
// Reads every src/components/ui/*.tsx with the TypeScript compiler API and writes src/component-docs.json:
// registry facts + exported *Props interfaces (own members, JSDoc, defaults, cva variant options).
import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uiDir = path.join(root, "src/components/ui");
const registry = JSON.parse(fs.readFileSync(path.join(root, "../registry/registry.json"), "utf8"));
// component-categories.ts is plain data: transpile it and import the result.
const catSrc = ts.transpileModule(fs.readFileSync(path.join(root, "src/component-categories.ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { COMPONENT_CATEGORIES } = await import("data:text/javascript;base64," + Buffer.from(catSrc).toString("base64"));
const catOf = Object.fromEntries(COMPONENT_CATEGORIES.flatMap(c => c.items.map(s => [s, c.id])));

const keyName = p => (p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : undefined);

function docOf(sf, member) {
  const jd = ts.getJSDocCommentsAndTags(member).find(ts.isJSDoc);
  const c = jd?.comment;
  return typeof c === "string" ? c.replace(/\s+/g, " ").trim() : Array.isArray(c) ? c.map(x => x.text ?? "").join("").replace(/\s+/g, " ").trim() : "";
}

function read(file) {
  const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  const cva = {}; // const name -> { variants: {prop: [keys]}, defaults: {prop: value} }
  const interfaces = [], defaults = {}; // defaults[propsTypeName][prop] = text
  const visit = node => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText() === "cva") {
      const cfg = node.initializer.arguments[1];
      const out = { variants: {}, defaults: {} };
      if (cfg && ts.isObjectLiteralExpression(cfg)) for (const p of cfg.properties) {
        if (!ts.isPropertyAssignment(p) || !ts.isObjectLiteralExpression(p.initializer)) continue;
        if (keyName(p) === "variants") for (const v of p.initializer.properties) if (ts.isPropertyAssignment(v) && ts.isObjectLiteralExpression(v.initializer)) out.variants[keyName(v)] = v.initializer.properties.map(keyName).filter(Boolean);
        if (keyName(p) === "defaultVariants") for (const v of p.initializer.properties) if (ts.isPropertyAssignment(v)) out.defaults[keyName(v)] = v.initializer.getText();
      }
      cva[node.name.text] = out;
    }
    if (ts.isInterfaceDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) && /Props$/.test(node.name.text)) interfaces.push(node);
    if ((ts.isArrowFunction(node) || ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) && node.parameters[0] && ts.isObjectBindingPattern(node.parameters[0].name)) {
      let t = node.parameters[0].type?.getText();
      const call = node.parent;
      if (!t && ts.isCallExpression(call) && call.typeArguments?.length) t = call.typeArguments[call.typeArguments.length - 1].getText();
      if (t) { const d = (defaults[t] ??= {}); for (const el of node.parameters[0].name.elements) if (el.initializer) d[(el.propertyName ?? el.name).getText()] = el.initializer.getText(); }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  const uses = [], exp = [];
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st) && /^\.\/[\w-]+$/.test(st.moduleSpecifier.text) && st.moduleSpecifier.text !== "./icons") uses.push(st.moduleSpecifier.text.slice(2));
    if (ts.isExportDeclaration(st) && st.exportClause && ts.isNamedExports(st.exportClause)) for (const e of st.exportClause.elements) if (/^[A-Z]/.test(e.name.text)) exp.push(e.name.text);
  }
  const list = interfaces.map(i => {
    const props = [];
    for (const h of i.heritageClauses ?? []) for (const t of h.types) {
      const m = /^VariantProps<typeof (\w+)>$/.exec(t.getText());
      if (m && cva[m[1]]) for (const [k, keys] of Object.entries(cva[m[1]].variants)) props.push({ name: k, type: keys.join(" | "), default: cva[m[1]].defaults[k], description: "" });
    }
    for (const m of i.members) {
      if (!ts.isPropertySignature(m) && !ts.isMethodSignature(m)) continue;
      const name = m.name.getText();
      const type = ts.isPropertySignature(m) ? (m.type?.getText() ?? "any") : `(${m.parameters.map(p => p.getText()).join(", ")}) => ${m.type?.getText() ?? "void"}`;
      const existing = props.find(p => p.name === name);
      const row = { name, type: type.replace(/\s+/g, " "), default: defaults[i.name.text]?.[name] ?? existing?.default, description: docOf(sf, m) };
      if (existing) Object.assign(existing, { ...row, type: existing.type }); else props.push(row);
    }
    return { name: i.name.text, props };
  });
  return { list, uses, exp };
}

// props = the component's own Props (the interface named after it, else the first); more = the other exported Props (parts like TabsTrigger).
const split = (slug, list) => {
  const main = list.find(l => l.name === slug.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase()) + "Props") ?? list[0];
  return { props: main?.props ?? [], more: list.filter(l => l !== main) };
};
// Registry titles are Title Case and a few name a part ("Menu Item"); the site uses sentence case and the component's own name.
const NAMES = { stepper: "Stepper", menu: "Menu", "tree-view": "Tree view", table: "Table", timeline: "Timeline", "sidebar-item": "Sidebar", sheet: "Bottom sheet", "bottom-nav": "Bottom navigation" };
const nice = (slug, title) => NAMES[slug] ?? title.replace(/\b([A-Za-z])([a-z]+)\b/g, (m, a, b, i) => (i === 0 ? m : a.toLowerCase() + b));
const out = {};
for (const it of registry.items) {
  if (it.type !== "registry:ui") continue;
  const file = path.join(uiDir, `${it.name}.tsx`);
  const r = fs.existsSync(file) ? read(file) : { list: [], uses: [], exp: [] };
  out[it.name] = { name: nice(it.name, it.title), exports: r.exp, uses: [...new Set(r.uses)], description: it.description, dependencies: it.dependencies ?? [], registryDependencies: it.registryDependencies ?? [], category: catOf[it.name] ?? null, ...split(it.name, r.list) };
}
fs.writeFileSync(path.join(root, "src/component-docs.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`component-docs.json: ${Object.keys(out).length} components, ${Object.values(out).reduce((n, c) => n + c.props.length + c.more.reduce((m, x) => m + x.props.length, 0), 0)} props`);

// ---------- examples: src/examples/*.tsx -> src/examples/code.json ----------
// A file exports `{ "slug": [{ title: "Default", Demo: SomeFunction }, ...] }`. Each Demo must be a top-level function
// that only uses imports (no other helpers), so it can be shown on its own as `export default function Example()`.
const exDir = path.join(root, "src/examples");
const codes = {}, jsx = {};
for (const f of fs.readdirSync(exDir).filter(f => f.endsWith(".tsx"))) {
  const sf = ts.createSourceFile(f, fs.readFileSync(path.join(exDir, f), "utf8"), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  const imports = {}, fns = {};
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st) && st.importClause) {
      const mod = st.moduleSpecifier.text.replace(/^\.\.\/components\/ui\//, "@/components/ui/");
      const c = st.importClause;
      if (c.name) imports[c.name.text] = { mod, kind: "default" };
      if (c.namedBindings && ts.isNamespaceImport(c.namedBindings)) imports[c.namedBindings.name.text] = { mod, kind: "ns" };
      else if (c.namedBindings) for (const e of c.namedBindings.elements) imports[e.name.text] = { mod, kind: "named" };
    }
    if (ts.isFunctionDeclaration(st) && st.name) fns[st.name.text] = st;
  }
  const idsOf = n => { const s = new Set(); const v = x => { if (ts.isIdentifier(x)) s.add(x.text); ts.forEachChild(x, v); }; v(n); return s; };
  const walk = n => {
    if (ts.isPropertyAssignment(n) && ts.isArrayLiteralExpression(n.initializer) && n.initializer.elements.every(ts.isObjectLiteralExpression)) {
      const slug = n.name.text ?? n.name.getText().replace(/"/g, "");
      n.initializer.elements.forEach((el, i) => {
        const get = k => el.properties.find(p => keyName(p) === k)?.initializer;
        const fn = fns[get("Demo")?.text];
        if (!fn) throw new Error(`${f}: ${slug}[${i}] has no top-level Demo function`);
        const ids = idsOf(fn);
        for (const other of Object.keys(fns)) if (other !== fn.name.text && ids.has(other)) throw new Error(`${f}: ${fn.name.text} uses ${other}; demos must be self-contained`);
        const by = {};
        for (const id of ids) if (imports[id]) (by[imports[id].mod] ??= []).push(id);
        const lines = Object.entries(by).map(([mod, names]) => imports[names[0]].kind === "ns" ? `import * as ${names[0]} from "${mod}";` : `import { ${names.sort().join(", ")} } from "${mod}";`);
        lines.sort((a, b) => (a.includes('"react"') ? -1 : b.includes('"react"') ? 1 : a.localeCompare(b)));
        let body = fn.getText().replace(new RegExp(`^function ${fn.name.text}\\b`), "export default function Example");
        codes[`${slug}/${i}`] = lines.join("\n") + "\n\n" + body + "\n";
        // The JSX the demo returns (for the "Usage" snippet).
        const ret = fn.body.statements.find(ts.isReturnStatement)?.expression;
        if (ret) jsx[`${slug}/${i}`] = ret.getText().replace(/^\(\s*|\s*\)$/g, "").replace(/^ {4}/gm, "");
      });
      return;
    }
    ts.forEachChild(n, walk);
  };
  for (const st of sf.statements) if (ts.isVariableStatement(st)) walk(st);
}
fs.writeFileSync(path.join(exDir, "code.json"), JSON.stringify({ code: codes, jsx }, null, 1) + "\n");
console.log(`examples/code.json: ${Object.keys(codes).length} demos`);
