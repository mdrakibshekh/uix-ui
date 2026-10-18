import * as React from "react";
import { Link } from "../router";
import { usePreset } from "../lib";
import { LOOKS, chromeVars, loadFont, mix, ramp, toward, type Look } from "../home/brand";
import { PageHeader } from "../site/Docs";
import "./themes.css";

/* The gallery of every theme: filter by mood, industry or name; open one for its colours, type and contrast. */

function Card({ l, worn, wear }: { l: Look; worn: boolean; wear: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { loadFont(l.display); loadFont(l.sans); io.disconnect(); } }, { rootMargin: "0px 600px" });
    io.observe(el); return () => io.disconnect();
  }, [l]);
  const v = chromeVars(l, false), tint = mix(l.light, "#FFFFFF", 0.9);
  return (
    <div ref={ref} className={`tcw${worn ? " worn" : ""}`}>
      <Link className="tc" to={`/themes/${l.id}`} aria-label={`${l.name} theme, made for ${l.industry}`}>
        <span className="tc-art" style={{ background: tint }}>
          <span className="tc-aa" style={{ fontFamily: `'${l.display}', var(--font)`, color: toward(l.light, "#000000", [tint], 7) }}>Aa</span>
          <span className="tc-ramp">{ramp(l.light).filter((_, i) => i % 2 === 0).map(c => <i key={c} style={{ background: c }} />)}</span>
          <span className="tc-btn" style={{ background: v.brand, color: v.on, borderRadius: l.radius, fontFamily: `'${l.sans}', var(--font)` }}>Button</span>
        </span>
        <span className="tc-meta"><b>{l.name}</b><small>For {l.industry} · {l.mood}</small></span>
      </Link>
      <button type="button" className="th-wear" aria-pressed={worn} aria-label={`Wear ${l.name} on this site`} onClick={wear}>{worn ? "Worn" : "Wear"}</button>
    </div>
  );
}

const count = (key: "mood" | "industry") => { const n = new Map<string, number>(); LOOKS.forEach(l => n.set(l[key], (n.get(l[key]) ?? 0) + 1)); return n; };
const MOODS = [...count("mood")].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8);
const INDUSTRIES = [...count("industry").keys()].sort();

export default function Themes() {
  const { id, set } = usePreset();
  const [mood, setMood] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [q, setQ] = React.useState("");
  const list = LOOKS.filter(l => (!mood || l.mood === mood) && (!industry || l.industry === industry) && (!q || `${l.name} ${l.mood} ${l.industry}`.toLowerCase().includes(q.trim().toLowerCase())));
  const clear = () => { setMood(""); setIndustry(""); setQ(""); };
  return (
    <main className="wrap th-page" id="content">
      <PageHeader title={<>Themes<span className="th-n">{LOOKS.length}</span></>} lead={`${LOOKS.length} themes, each a full colour system with fonts, corner radius and a dark mode. Open one to see its colours and contrast, or wear it to see this whole site in it.`} />
      <div className="th-filters">
        <label className="th-field"><span className="sr">Search themes by name</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name" />
        </label>
        <label className="th-field">Made for
          <select value={industry} onChange={e => setIndustry(e.target.value)}>
            <option value="">Anything</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
      </div>
      <div className="moods" role="group" aria-label="Filter themes by mood">
        <button type="button" aria-pressed={!mood} onClick={() => setMood("")}>All <span>{LOOKS.length}</span></button>
        {MOODS.map(([m, n]) => <button key={m} type="button" aria-pressed={mood === m} onClick={() => setMood(mood === m ? "" : m)}>{m} <span>{n}</span></button>)}
      </div>
      <p className="th-meta-line" aria-live="polite">Showing {list.length} of {LOOKS.length}</p>
      {list.length ? (
        <div className="th-grid">{list.map(l => <Card key={l.id} l={l} worn={id === l.id} wear={() => set(l.id)} />)}</div>
      ) : (
        <div className="th-empty"><p>No theme matches that. Try fewer filters.</p><button type="button" className="btn b-line" onClick={clear}>Clear filters</button></div>
      )}
    </main>
  );
}
