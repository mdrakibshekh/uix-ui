import * as React from "react";
import { Link, useRoute } from "../router";
import { useCopy } from "../lib";
import { useDemo } from "../home/look";
import { PM } from "../home/logos";
import { Logo } from "../home/Themes";
import "./docs.css";

/* Shared building blocks for every docs-style page (docs, components, themes): sidebar, header, table of contents,
   live preview with code, install tabs, code blocks and props tables. Pages compose these; they own no layout CSS. */

export type NavItem = { label: string; to: string; badge?: string };
export type NavGroup = { title: string; items: NavItem[] };

export const GUIDES: NavGroup = {
  title: "Getting started",
  items: [
    { label: "Introduction", to: "/docs" }, { label: "Installation", to: "/docs/installation" }, { label: "Theming", to: "/docs/theming" },
    { label: "Dark mode", to: "/docs/dark-mode" }, { label: "CLI", to: "/docs/cli" }, { label: "MCP and AI agents", to: "/docs/mcp" }, { label: "Figma", to: "/docs/figma" },
  ],
};

export type TocItem = { id: string; label: string; depth?: 2 | 3 };

/** Sidebar + content + "On this page". On small screens the sidebar folds into a menu at the top. */
export function DocsLayout({ nav, toc, children }: { nav: NavGroup[]; toc?: TocItem[]; children: React.ReactNode }) {
  const { path } = useRoute();
  const [here, setHere] = React.useState(toc?.[0]?.id ?? "");
  React.useEffect(() => {
    if (!toc?.length) return;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setHere(e.target.id); }), { rootMargin: "-20% 0px -70% 0px" });
    toc.forEach(t => { const el = document.getElementById(t.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [toc?.map(t => t.id).join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  const side = nav.map(g => (
    <div className="dgroup" key={g.title}>
      <h5>{g.title}</h5>
      {g.items.map(i => <Link key={i.to} to={i.to} className={path === i.to ? "on" : undefined} aria-current={path === i.to ? "page" : undefined}>{i.label}{i.badge && <span className="dbadge">{i.badge}</span>}</Link>)}
    </div>
  ));
  return (
    <div className="wrap dlayout">
      <aside className="dside" aria-label="Section navigation"><div className="dside-in">{side}</div></aside>
      <details className="dside-m"><summary>Menu</summary>{side}</details>
      <main className="dmain2" id="content">{children}</main>
      {toc?.length ? <aside className="dtoc" aria-label="On this page"><b>On this page</b>{toc.map(t => <a key={t.id} href={`#${t.id}`} className={`${here === t.id ? "on" : ""}${t.depth === 3 ? " d3" : ""}`}>{t.label}</a>)}</aside> : <div className="dtoc" />}
    </div>
  );
}

export function PageHeader({ crumbs, title, lead, children }: { crumbs?: NavItem[]; title: React.ReactNode; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="dhead">
      {crumbs && <nav className="crumbs" aria-label="Breadcrumb">{crumbs.map((c, i) => <React.Fragment key={c.to}>{i > 0 && <span aria-hidden>›</span>}<Link to={c.to}>{c.label}</Link></React.Fragment>)}</nav>}
      <h1>{title}</h1>
      {lead && <p className="dlead">{lead}</p>}
      {children && <div className="dhead-acts">{children}</div>}
    </header>
  );
}

/** A heading inside a docs page, with an anchor link. Use the same id in the page's toc list. */
export function H2({ id, children }: { id: string; children: React.ReactNode }) { return <h2 className="dh2" id={id}><a href={`#${id}`} className="anchor" aria-hidden tabIndex={-1}>#</a>{children}</h2>; }
export function H3({ id, children }: { id: string; children: React.ReactNode }) { return <h3 className="dh3" id={id}><a href={`#${id}`} className="anchor" aria-hidden tabIndex={-1}>#</a>{children}</h3>; }

/* ---------------- code ---------------- */
// ponytail: one-pass tokenizer for short docs snippets (JSX, TS, shell, CSS); swap for Shiki if snippets grow complex.
const TOKEN = /(\/\/[^\n]*|^#[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*'|`[^`\n]*`)|(<\/?)([A-Za-z][\w.]*)|\b(import|from|export|default|function|return|const|let|type|interface|true|false)\b|([a-zA-Z-]+)(?==)/gm;
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
function highlight(code: string) {
  let out = "", last = 0;
  for (const m of code.matchAll(TOKEN)) {
    out += esc(code.slice(last, m.index)); last = m.index! + m[0].length;
    const [, cm, str, lt, tag, kw, attr] = m;
    out += cm ? `<span class="cm">${esc(cm)}</span>` : str ? `<span class="str">${esc(str)}</span>` : tag ? `${esc(lt)}<span class="t">${tag}</span>` : kw ? `<span class="k">${kw}</span>` : attr ? `<span class="a">${attr}</span>` : esc(m[0]);
  }
  return out + esc(code.slice(last));
}

export function Code({ code, file, lang = "tsx" }: { code: string; file?: string; lang?: "tsx" | "sh" | "css" | "json" }) {
  const { copy, done } = useCopy();
  return (
    <div className="dcode">
      <div className="dcode-bar"><span>{file ?? (lang === "sh" ? "Terminal" : lang)}</span><button type="button" onClick={() => copy(code)} aria-label="Copy code">{done === code ? "Copied" : "Copy"}</button></div>
      <pre tabIndex={0}><code dangerouslySetInnerHTML={{ __html: highlight(code) }} /></pre>
    </div>
  );
}

/** Live preview with a Code tab. Children are rendered inside the current theme, skin and shape. */
export function Preview({ code, children, center = true, minHeight = 220 }: { code: string; children: React.ReactNode; center?: boolean; minHeight?: number }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const demo = useDemo();
  const id = React.useId();
  return (
    <div className="dprev">
      <div className="dprev-tabs" role="tablist" aria-label="Example">
        <button type="button" role="tab" id={`${id}-p`} aria-controls={`${id}-pp`} aria-selected={tab === "preview"} onClick={() => setTab("preview")}>Preview</button>
        <button type="button" role="tab" id={`${id}-c`} aria-controls={`${id}-cp`} aria-selected={tab === "code"} onClick={() => setTab("code")}>Code</button>
      </div>
      <div role="tabpanel" id={`${id}-pp`} aria-labelledby={`${id}-p`} hidden={tab !== "preview"} className={`dprev-box${center ? " center" : ""}`} style={{ minHeight }} {...demo}>{children}</div>
      <div role="tabpanel" id={`${id}-cp`} aria-labelledby={`${id}-c`} hidden={tab !== "code"}><Code code={code} /></div>
    </div>
  );
}

/** npm / pnpm / yarn / bun tabs for one command. `cmd` gets the runner ("npx", "pnpm dlx", ...). */
const RUN = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx --bun" } as const;
export type PmId = keyof typeof RUN;
export function Install({ cmd }: { cmd: (run: string, pm: PmId) => string }) {
  const [pm, setPm] = React.useState<PmId>("npm");
  React.useEffect(() => { try { const s = localStorage.getItem("uixui.pm") as PmId | null; if (s && s in RUN) setPm(s); } catch { /* private mode */ } }, []);
  const pick = (p: PmId) => { setPm(p); try { localStorage.setItem("uixui.pm", p); } catch { /* private mode */ } };
  const text = cmd(RUN[pm], pm);
  const { copy, done } = useCopy();
  return (
    <div className="dinstall">
      <div className="dinstall-tabs">
        <div role="tablist" aria-label="Package manager" className="dinstall-pm">
          {(Object.keys(RUN) as PmId[]).map(p => <button key={p} type="button" role="tab" aria-selected={pm === p} onClick={() => pick(p)}><Logo m={PM[p]} size={14} />{p}</button>)}
        </div>
        <button type="button" className="dcopy" onClick={() => copy(text)} aria-label={`Copy: ${text}`}>{done === text ? "Copied" : "Copy"}</button>
      </div>
      <pre tabIndex={0}><code><span className="p">$ </span>{text}</code></pre>
    </div>
  );
}

export type PropRow = { name: string; type: string; default?: string; description?: string };
export function PropsTable({ rows }: { rows: PropRow[] }) {
  if (!rows.length) return <p className="dmuted">This component takes the standard HTML attributes of its root element.</p>;
  return (
    <div className="dtable" role="region" aria-label="Props" tabIndex={0}>
      <table><thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Description</th></tr></thead>
        <tbody>{rows.map(r => <tr key={r.name}><td><code>{r.name}</code></td><td><code className="ty">{r.type}</code></td><td>{r.default ? <code>{r.default}</code> : <span className="dmuted">–</span>}</td><td>{r.description ?? ""}</td></tr>)}</tbody></table>
    </div>
  );
}

export function Callout({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "pro" | "warn" }) {
  return <div className={`dcall ${tone}`} role="note">{children}</div>;
}

export function PrevNext({ prev, next }: { prev?: NavItem; next?: NavItem }) {
  return (
    <nav className="dpn" aria-label="Previous and next">
      {prev ? <Link to={prev.to}><small>Previous</small>{prev.label}</Link> : <span />}
      {next ? <Link to={next.to} className="nx"><small>Next</small>{next.label}</Link> : <span />}
    </nav>
  );
}
