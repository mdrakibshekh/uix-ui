import * as React from "react";
import { DocsLayout, GUIDES, PageHeader, H2, type NavGroup } from "../site/Docs";
import { Link } from "../router";
import { useDemo } from "../home/look";
import { COMPONENT_CATEGORIES } from "../component-categories";
import docs from "../component-docs.json";
import { EXAMPLES, TILE_WIDTH } from "../examples";
import "./components.css";

type Doc = { name: string; description: string };
export const DOCS = docs as unknown as Record<string, Doc>;

/** Sidebar for every component page: the guides, then one group per category. */
export const componentNav = (): NavGroup[] => [
  GUIDES,
  ...COMPONENT_CATEGORIES.map(c => ({ title: c.name, items: c.items.map(s => ({ label: DOCS[s]?.name ?? s, to: `/components/${s}` })) })),
];

/** One small live preview, shrunk to fit its box. It is decoration only: the whole tile is the link. */
function Tile({ slug }: { slug: string }) {
  const demo = useDemo();
  const box = React.useRef<HTMLDivElement>(null);
  const inner = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.7);
  const ex = EXAMPLES[slug]?.[0];
  React.useEffect(() => {
    const b = box.current, i = inner.current;
    if (!b || !i) return;
    const fit = () => {
      const w = i.offsetWidth || 1, h = i.offsetHeight || 1;
      setScale(Math.max(0.3, Math.min(1, (b.clientWidth - 24) / w, (b.clientHeight - 24) / h)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b); ro.observe(i);
    return () => ro.disconnect();
  }, []);
  const width = TILE_WIDTH[slug];
  return (
    <div className="cx-pv" ref={box} aria-hidden {...demo} {...{ inert: "" }}>
      <div className="cx-pv-in" ref={inner} style={{ width: width ?? "max-content", transform: `translate(-50%,-50%) scale(${scale})` }}>{ex?.render()}</div>
    </div>
  );
}

export default function Components() {
  const [q, setQ] = React.useState("");
  const total = COMPONENT_CATEGORIES.reduce((n, c) => n + c.items.length, 0);
  const needle = q.trim().toLowerCase();
  const groups = COMPONENT_CATEGORIES.map(c => ({ ...c, items: c.items.filter(s => !needle || `${DOCS[s]?.name} ${DOCS[s]?.description} ${s}`.toLowerCase().includes(needle)) })).filter(c => c.items.length);
  const shown = groups.reduce((n, c) => n + c.items.length, 0);
  return (
    <DocsLayout nav={componentNav()} toc={COMPONENT_CATEGORIES.map(c => ({ id: c.id, label: c.name }))}>
      <PageHeader title="Components" lead={`${total} components you copy into your project and own. Every preview below is the real component, wearing the theme you picked.`}>
        <div className="cx-find">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search components" aria-label="Search components" />
        </div>
      </PageHeader>
      <p className="cx-count" role="status">{needle ? `${shown} of ${total} components` : `${total} components in ${COMPONENT_CATEGORIES.length} groups`}</p>
      {groups.length === 0 ? <p className="cx-empty">No component matches “{q}”. Try “button”, “date” or “menu”.</p> : null}
      {groups.map(c => (
        <section className="cx-cat" key={c.id}>
          <H2 id={c.id}>{c.name} <small>{c.items.length}</small></H2>
          <ul className="cx-grid">
            {c.items.map(s => (
              <li key={s} className="cx-tile">
                <Tile slug={s} />
                <div className="cx-meta"><Link to={`/components/${s}`}>{DOCS[s]?.name}</Link><p>{DOCS[s]?.description}</p></div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </DocsLayout>
  );
}
