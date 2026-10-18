import * as React from "react";
import { ALL, COUNTS, usePreset } from "../lib";
import { Link } from "../router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Avatar } from "../components/ui/avatar";
import { fontsOf, lookById, mix } from "./brand";
import { useDemo } from "./look";
import { Copy } from "./bits";

const QUICK = ["uix", "lagoon-stretch", "ember-ledger", "ticker-cerulean", "beetroot-harrow", "sonata-whisker"];
const NOTI = [["NJ", "Nusrat Jahan paid ৳1,999", "Order #2841"], ["IJ", "Israt Jahan placed an order", "Order #2842 · 2 items"], ["AK", "Arif Khan left a 5-star review", "Masala chai, 250 g"], ["RS", "Stock is low on Sylhet green", "8 tins left"], ["NJ", "Nusrat Jahan replied", "Gift box order for Eid"]];
export const still = () => typeof window === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Counts up to `to` once mounted (instantly with reduced motion). */
function useCount(to: number, ms = 1500) {
  const [v, setV] = React.useState(to);
  React.useEffect(() => {
    if (still()) return;
    let raf = 0; const t0 = performance.now(); setV(0);
    const f = (t: number) => { const k = Math.min(1, (t - t0) / ms); setV(Math.round(to * (1 - (1 - k) ** 3))); if (k < 1) raf = requestAnimationFrame(f); };
    const id = setTimeout(() => (raf = requestAnimationFrame(f)), 500);
    return () => { clearTimeout(id); cancelAnimationFrame(raf); };
  }, [to, ms]);
  return v;
}

function ThemeSwitch() {
  const { id, set, mode, setMode } = usePreset();
  const look = lookById(id);
  const [spin, setSpin] = React.useState(0);
  const shuffle = () => { const pool = ALL.filter(p => p.id !== id); set(pool[Math.floor(Math.random() * pool.length)].id); setSpin(s => s + 1); };
  return (
    <div className="tswitch rise" style={{ ["--d" as any]: "320ms" }}>
      <div className="ts-top"><span className="ts-l">Try a theme</span><span className="ts-name"><b>{look.name}</b><small>{fontsOf(look)}</small></span></div>
      <div className="ts-row">
        <div className="ts-sw" role="group" aria-label="Theme">
          {QUICK.map(q => { const l = lookById(q); return <button key={q} type="button" className="hsw" data-name={l.name} aria-label={l.name} aria-pressed={id === q} onClick={() => set(q)} style={{ ["--c1" as any]: l.light, ["--c2" as any]: mix(l.light, "#FFFFFF", 0.55) }} />; })}
        </div>
        <span className="ts-sep" />
        <button type="button" className={`ts-btn${spin ? " spin" : ""}`} key={spin} onClick={shuffle} aria-label="Pick a random theme" title="Random theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" /><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></svg>
        </button>
        <button type="button" className="ts-btn" onClick={() => setMode(mode === "dark" ? "light" : "dark")} aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"} title="Light or dark">
          {mode === "dark" ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>}
        </button>
        <Link className="ts-more" to="/#themes">All {COUNTS.free + 1} →</Link>
      </div>
    </div>
  );
}

function Notifications() {
  const [list, setList] = React.useState(() => NOTI.slice(0, 3).map((n, i) => ({ n, when: ["just now", "4 min ago", "12 min ago"][i], k: i })));
  React.useEffect(() => {
    if (still()) return;
    let i = 3;
    const t = setInterval(() => { if (document.hidden) return; setList(l => [{ n: NOTI[i % NOTI.length], when: "just now", k: i++ }, ...l.map(x => ({ ...x, when: x.when === "just now" ? "1 min ago" : x.when }))].slice(0, 3)); }, 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="noti">
      {list.map(({ n, when, k }) => (
        <div className="nitem" key={k}><Avatar size="sm" initials={n[0]} /><div><b>{n[1]}</b><small>{n[2]} · {when}</small></div>{when === "just now" && <span className="ndot" aria-hidden />}</div>
      ))}
    </div>
  );
}

function Stack() {
  const demo = useDemo();
  const { id } = usePreset();
  const rev = useCount(482300);
  const ref = React.useRef<HTMLDivElement>(null);
  const first = React.useRef(true);
  // A short squash when the theme changes (no remount, so inputs and the notification list keep their state).
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    if (first.current) { first.current = false; return; }
    if (still()) return;
    el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap");
    const t = setTimeout(() => el.classList.remove("swap"), 750); return () => clearTimeout(t);
  }, [id]);
  React.useEffect(() => {
    const hero = ref.current?.closest(".hero") as HTMLElement | null, inner = ref.current;
    if (!hero || !inner || still()) return;
    const move = (e: PointerEvent) => { const r = hero.getBoundingClientRect(); inner.style.setProperty("--mx", String(((e.clientX - r.left) / r.width - 0.5) * 2)); inner.style.setProperty("--my", String(((e.clientY - r.top) / r.height - 0.5) * 2)); };
    const leave = () => { inner.style.setProperty("--mx", "0"); inner.style.setProperty("--my", "0"); };
    hero.addEventListener("pointermove", move); hero.addEventListener("pointerleave", leave);
    return () => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); };
  }, []);
  return (
    <div className="stack" {...demo} aria-label="Live uix-ui components">
      <div className="stack-in" ref={ref}>
        <Card className="sc sc1 gap-3 p-5" style={{ ["--d" as any]: ".25s" }}>
          <div className="row sp"><span className="text-body-small text-fg-secondary">Revenue this week</span><Badge color="success" size="sm">↗ 12.4%</Badge></div>
          <div className="big font-heading text-fg-primary">৳{rev.toLocaleString("en-IN")}</div>
          <svg className="hline" viewBox="0 0 320 96" preserveAspectRatio="none" aria-hidden><defs><linearGradient id="hg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".22" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs><path className="area" d="M0 70 C30 64 48 44 80 48 S128 66 160 52 S214 18 246 26 S292 34 320 10 V96 H0Z" fill="url(#hg)" /><path className="ln" d="M0 70 C30 64 48 44 80 48 S128 66 160 52 S214 18 246 26 S292 34 320 10" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" /></svg>
          <div className="days text-fg-secondary">{["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map(d => <span key={d}>{d}</span>)}</div>
        </Card>
        <Card className="sc sc2 gap-3 p-5" style={{ ["--d" as any]: ".4s" }}>
          <div><h3 className="text-title-medium font-heading">Create an account</h3><p className="text-body-small text-fg-secondary">Start your shop in a minute.</p></div>
          <Input placeholder="you@shapla.app" aria-label="Email" />
          <Button className="w-full">Sign up</Button>
          <Switch label="Email me about orders" defaultChecked />
        </Card>
        <Card className="sc sc3 gap-2 p-5" style={{ ["--d" as any]: ".55s" }}>
          <div className="row sp"><h3 className="text-title-medium font-heading">Notifications</h3><Badge size="sm" dot>Live</Badge></div>
          <Notifications />
        </Card>
        <div className="sc sc4" style={{ ["--d" as any]: ".7s" }}><span className="pulse" />Wearing <b>{lookById(id).name}</b></div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <div className="htext">
        <Link className="ann rise" style={{ ["--d" as any]: "0ms" }} to="/components"><b>New</b>uix-ui 0.1: 64 components and {COUNTS.free + 1} themes →</Link>
        <h1 className="rise" style={{ ["--d" as any]: "80ms" }}>The component library for <span>your own</span> design system</h1>
        <p className="sub rise" style={{ ["--d" as any]: "160ms" }}>Accessible React components and Tailwind CSS v4 themes. Copy them into your project, own every line, and change the whole look with one theme file.</p>
        <div className="acts rise" style={{ ["--d" as any]: "240ms" }}><Link className="btn b-brand lg" to="/docs/installation">Get started</Link><Link className="btn b-line lg" to="/components">Browse components</Link></div>
        <ThemeSwitch />
        <Copy className="pill rise" style={{ ["--d" as any]: "400ms" }} text="npx uix-ui@latest init" />
      </div>
      <Stack />
    </section>
  );
}
