import * as React from "react";
import { usePreset } from "../lib";
import { WORKS, type Mark } from "./logos";
import { LOOKS, chromeVars, fontsOf, loadFont, lookById, mix, ramp, toward, type Look } from "./brand";
import { SKINS, useLook, type Shape } from "./look";
import { Copy, Head } from "./bits";

export const Logo = ({ m, size = 20 }: { m: Mark; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden><path fill="currentColor" d={m.p} /></svg>
);

export function LogoStrip() {
  return (
    <section className="works2" aria-label="Works with">
      <p>Works with the tools you already use</p>
      <div className="logos">
        {WORKS.map(m => <span key={m.t} className="logo-i" style={{ ["--c" as any]: m.h, ["--cd" as any]: m.h === "#000000" ? "#FFFFFF" : m.h }}><Logo m={m} />{m.t}</span>)}
      </div>
    </section>
  );
}

function ThemeCard({ l, on, onPick }: { l: Look; on: boolean; onPick: () => void }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { loadFont(l.display); loadFont(l.sans); io.disconnect(); } }, { rootMargin: "0px 600px" });
    io.observe(el); return () => io.disconnect();
  }, [l]);
  const v = chromeVars(l, false), tint = mix(l.light, "#FFFFFF", 0.9);
  return (
    <button ref={ref} type="button" className="tc" aria-pressed={on} onClick={onPick} aria-label={`${l.name}, made for ${l.industry}`}>
      <span className="tc-art" style={{ background: tint }}>
        <span className="tc-aa" style={{ fontFamily: `'${l.display}', var(--font)`, color: toward(l.light, "#000000", [tint], 7) }}>Aa</span>
        <span className="tc-ramp">{ramp(l.light).filter((_, i) => i % 2 === 0).map(c => <i key={c} style={{ background: c }} />)}</span>
        <span className="tc-btn" style={{ background: v.brand, color: v.on, borderRadius: l.radius, fontFamily: `'${l.sans}', var(--font)` }}>Button</span>
      </span>
      <span className="tc-meta"><b>{l.name}</b><small>For {l.industry} · {l.mood}</small></span>
      <span className="tc-check" aria-hidden>✓</span>
    </button>
  );
}

/** The cards' own scrollbar: a draggable thumb, a clickable track and a "5–9 of 42" count. */
function useBar(car: React.RefObject<HTMLDivElement>, deps: unknown[]) {
  const bar = React.useRef<HTMLDivElement>(null), thumb = React.useRef<HTMLSpanElement>(null);
  const [count, setCount] = React.useState("");
  const sync = React.useCallback(() => {
    const c = car.current, b = bar.current, t = thumb.current; if (!c || !b || !t) return;
    const sw = c.scrollWidth, cw = c.clientWidth, tw = b.clientWidth, w = Math.max(48, tw * Math.min(1, cw / Math.max(1, sw)));
    t.style.width = `${w}px`; t.style.transform = `translateX(${(sw - cw > 0 ? c.scrollLeft / (sw - cw) : 0) * (tw - w)}px)`;
    const cards = [...c.querySelectorAll<HTMLElement>(".tc")], cardW = (cards[0]?.offsetWidth ?? 224) + 14;
    const first = Math.min(cards.length, Math.floor(c.scrollLeft / cardW) + 1), last = Math.min(cards.length, Math.floor((c.scrollLeft + cw) / cardW));
    setCount(`${first}–${Math.max(first, last)} of ${cards.length}`);
  }, [car]);
  React.useEffect(() => {
    const c = car.current; if (!c) return;
    sync(); c.addEventListener("scroll", sync, { passive: true }); addEventListener("resize", sync);
    return () => { c.removeEventListener("scroll", sync); removeEventListener("resize", sync); };
  }, [sync]);
  React.useEffect(() => { const t = setTimeout(sync, 30); return () => clearTimeout(t); }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  const drag = React.useRef<{ x: number; s: number } | null>(null);
  const handlers = {
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); e.stopPropagation(); (e.target as HTMLElement).setPointerCapture(e.pointerId); drag.current = { x: e.clientX, s: car.current!.scrollLeft }; bar.current!.classList.add("drag"); },
    onPointerMove: (e: React.PointerEvent) => { const d = drag.current, c = car.current; if (!d || !c) return; c.scrollLeft = d.s + (e.clientX - d.x) * ((c.scrollWidth - c.clientWidth) / Math.max(1, bar.current!.clientWidth - thumb.current!.offsetWidth)); },
    onPointerUp: () => { drag.current = null; bar.current!.classList.remove("drag"); },
  };
  const jump = (e: React.PointerEvent) => { if (e.target !== bar.current) return; const r = bar.current!.getBoundingClientRect(), c = car.current!; c.scrollTo({ left: ((e.clientX - r.left) / r.width) * (c.scrollWidth - c.clientWidth), behavior: "smooth" }); };
  return { bar, thumb, count, handlers, jump };
}

export function ThemesSection() {
  const { id, set } = usePreset();
  const { skin, setSkin, shape, setShape } = useLook();
  const [mood, setMood] = React.useState("");
  const car = React.useRef<HTMLDivElement>(null);
  const moods = React.useMemo(() => { const n = new Map<string, number>(); LOOKS.forEach(l => n.set(l.mood, (n.get(l.mood) ?? 0) + 1)); return [...n].sort((a, b) => b[1] - a[1]).slice(0, 6); }, []);
  const { bar, thumb, count, handlers, jump } = useBar(car, [mood]);
  const look = lookById(id), v = chromeVars(look, false);
  const scrollBy = (dir: number) => car.current?.scrollBy({ left: dir * car.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="sec" id="themes" style={{ paddingTop: 72 }}>
      <Head eyebrow="Themes" title="Find a look that feels like yours" lead={<>{LOOKS.length} themes, each a full design system: colours, type, radius, light and dark. Tap a card and this whole page wears it. Then change the style and shape to see how far one system can go.</>}>
        <div className="carnav"><button type="button" aria-label="Previous themes" onClick={() => scrollBy(-1)}>‹</button><button type="button" aria-label="Next themes" onClick={() => scrollBy(1)}>›</button></div>
      </Head>
      <div className="moods" role="group" aria-label="Filter themes by mood">
        <button type="button" aria-pressed={!mood} onClick={() => { setMood(""); car.current?.scrollTo({ left: 0 }); }}>All <span>{LOOKS.length}</span></button>
        {moods.map(([m, n]) => <button key={m} type="button" aria-pressed={mood === m} onClick={() => { setMood(m); car.current?.scrollTo({ left: 0 }); }}>{m} <span>{n}</span></button>)}
      </div>
      <div className="car" ref={car} role="group" aria-label="Themes">
        {LOOKS.filter(l => !mood || l.mood === mood).map(l => <ThemeCard key={l.id} l={l} on={id === l.id} onPick={() => set(l.id)} />)}
      </div>
      <div className="cbar-row"><div className="cbar" ref={bar} onPointerDown={jump} aria-hidden><span className="cthumb" ref={thumb} {...handlers} /></div><span className="ccount">{count}</span></div>
      <div className="wear">
        <div className="wear-l"><span className="wear-dot" /><div><b>{look.name}</b><small>{fontsOf(look)} · radius {look.radius} px · button text {v.ratio.toFixed(2)}:1 AA</small></div></div>
        <div className="ramp-s" aria-hidden>{ramp(look.light).map(c => <i key={c} style={{ background: c }} />)}</div>
        <div className="vrow"><span className="lbl">Style</span><span className="segm" role="group" aria-label="Style">
          {SKINS.map(s => <button key={s.id} type="button" aria-pressed={skin === s.id} onClick={() => setSkin(s.id)}>{s.name}{s.pro && <span className="pro">Pro</span>}</button>)}
        </span></div>
        <div className="vrow"><span className="lbl">Shape</span><span className="segm" role="group" aria-label="Shape">
          {(["sharp", "rounded", "pill"] as Shape[]).map(s => <button key={s} type="button" aria-pressed={shape === s} onClick={() => setShape(s)}>{s[0].toUpperCase() + s.slice(1)}</button>)}
        </span></div>
        <Copy className="pill" text={`npx uix-ui theme ${look.id}`} />
      </div>
    </section>
  );
}
