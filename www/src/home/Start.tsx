import * as React from "react";
import { usePreset, useCopy } from "../lib";
import { Link } from "../router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { PAGES, BLOCKS, type Tpl } from "./templates-html";
import { PM, FW } from "./logos";
import { Logo } from "./Themes";
import { lookById, ramp } from "./brand";
import { useDemo } from "./look";
import { Copy, Head } from "./bits";
import { still } from "./Hero";

/* ---------------- templates: two rows drifting in opposite directions ---------------- */
const TplCard = ({ t, hidden }: { t: Tpl; hidden?: boolean }) => (
  <div className="tpl" aria-hidden={hidden || undefined}><div className="cw-bar"><i /><i /><i /><span>{t.url}</span><em>{t.tag}</em></div><div className="tpv" dangerouslySetInnerHTML={{ __html: t.html }} /></div>
);
export function Templates() {
  const [loop, setLoop] = React.useState(false);
  React.useEffect(() => setLoop(!still()), []);
  const row = (list: Tpl[], cls: string) => <div className={`ttrack ${cls}`}>{list.map(t => <TplCard key={t.url} t={t} />)}{loop && list.map(t => <TplCard key={t.url + "2"} t={t} hidden />)}</div>;
  return (
    <section className="sec" id="templates">
      <Head eyebrow="Templates and blocks · UIX Pro" title="Whole pages, ready to start from" lead="Landing, pricing, settings, sign-in and dashboard pages, plus marketing blocks, all built from the same components and wearing whatever theme you pick.">
        <Link className="btn b-line" to="/templates">See all templates</Link>
      </Head>
      <div className="tmarq" tabIndex={0} role="region" aria-label="Page templates and blocks">{row(PAGES, "")}{row(BLOCKS, "rev")}</div>
    </section>
  );
}

/* ---------------- get started: package manager, framework, four steps, live terminal + app ---------------- */
type PMId = keyof typeof PM;
type FWId = keyof typeof FW;
const PMX: Record<PMId, string> = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx --bun" };
const CREATE: Record<FWId, { name: string; note: string; cmd?: Record<PMId, string>; tw?: Record<PMId, string> }> = {
  next: { name: "Next.js", note: "Say yes to Tailwind CSS when it asks.", cmd: { npm: "npx create-next-app@latest my-shop", pnpm: "pnpm create next-app my-shop", yarn: "yarn create next-app my-shop", bun: "bun create next-app my-shop" } },
  vite: { name: "Vite", note: "Then add Tailwind CSS v4 with its Vite plugin.", cmd: { npm: "npm create vite@latest my-shop -- --template react-ts", pnpm: "pnpm create vite my-shop --template react-ts", yarn: "yarn create vite my-shop --template react-ts", bun: "bun create vite my-shop --template react-ts" }, tw: { npm: "npm install tailwindcss @tailwindcss/vite", pnpm: "pnpm add tailwindcss @tailwindcss/vite", yarn: "yarn add tailwindcss @tailwindcss/vite", bun: "bun add tailwindcss @tailwindcss/vite" } },
  astro: { name: "Astro", note: "Then add React and Tailwind with astro add.", cmd: { npm: "npm create astro@latest my-shop", pnpm: "pnpm create astro@latest my-shop", yarn: "yarn create astro my-shop", bun: "bun create astro my-shop" }, tw: { npm: "npx astro add react tailwind", pnpm: "pnpm astro add react tailwind", yarn: "yarn astro add react tailwind", bun: "bunx astro add react tailwind" } },
  react: { name: "Existing app", note: "Already have React and Tailwind CSS v4? Start from step 2." },
};
type Out = string | [string];

export function GetStarted() {
  const { id } = usePreset();
  const look = lookById(id), next = id === "ember-ledger" ? lookById("lagoon-stretch") : lookById("ember-ledger");
  const [pm, setPm] = React.useState<PMId>("npm"), [fw, setFw] = React.useState<FWId>("next");
  const [step, setStep] = React.useState(0), [paused, setPaused] = React.useState(false), [term, setTerm] = React.useState<React.ReactNode>(null), [view, setView] = React.useState(0);
  const { copy, done } = useCopy();
  const c = CREATE[fw], x = PMX[pm];
  const steps: { t: string; d: string; cmd: string; out: Out[]; view: number }[] = [
    { t: "Create your app", d: c.note, cmd: c.cmd ? c.cmd[pm] : "cd my-shop", out: c.cmd ? [`  creating a new ${c.name} app in ./my-shop`, ...(c.tw ? [`  next: ${c.tw[pm]}`] : []), ["  ready"]] : ["  using your existing project"], view: 0 },
    { t: "Set up the theme", d: "Writes components.json, the theme CSS and the cn() helper.", cmd: `${x} uix-ui@latest init --preset ${look.id}`, out: ["  wrote   components.json", `  wrote   src/styles/uix.css   (${look.name})`, "  wrote   src/lib/utils.ts", ["  done"]], view: 1 },
    { t: "Add what you need", d: "Only the components you pick. Dependencies install for you.", cmd: `${x} uix-ui@latest add button card switch input`, out: ["  wrote   src/components/ui/button.tsx", "  wrote   src/components/ui/card.tsx", "  wrote   src/components/ui/switch.tsx", "  wrote   src/components/ui/input.tsx", ["  done · no AI tokens used"]], view: 2 },
    { t: "Switch the look any time", d: "One command changes the whole theme. Components stay as you left them.", cmd: `${x} uix-ui@latest theme ${next.id}`, out: ["  wrote   src/styles/uix.css", `  fonts   ${next.display} + ${next.sans}`, ["  switched · 0 components changed"]], view: 3 },
  ];
  const run = React.useRef(0), box = React.useRef<HTMLDivElement>(null), seen = React.useRef(false);
  const play = React.useCallback(async (i: number, auto: boolean) => {
    const my = ++run.current, live = () => my === run.current, quick = still(), w = (ms: number) => new Promise(r => setTimeout(r, quick ? 0 : ms));
    setStep(i); const st = steps[i];
    const pre = <span className="p">$ </span>;
    for (let k = 1; k <= st.cmd.length && !quick; k += 2) { if (!live()) return; setTerm(<>{pre}<span className="c">{st.cmd.slice(0, k)}</span><span className="cur" /></>); await w(24); }
    const lines: React.ReactNode[] = [];
    setTerm(<>{pre}<span className="c">{st.cmd}</span>{"\n"}</>);
    for (const o of st.out) { await w(240); if (!live()) return; lines.push(Array.isArray(o) ? <span className="g" key={lines.length}>{o[0]}{"\n"}</span> : <span className="p" key={lines.length}>{o}{"\n"}</span>); setTerm(<>{pre}<span className="c">{st.cmd}</span>{"\n"}{lines.slice()}</>); }
    setView(st.view);
    if (!auto || quick) return;
    await w(2600);
    while (pausedRef.current) { await w(300); if (!live()) return; }
    if (live()) play((i + 1) % 4, true);
  }, [steps.map(s => s.cmd).join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  const pausedRef = React.useRef(paused); pausedRef.current = paused;
  React.useEffect(() => {
    const el = box.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !seen.current) { seen.current = true; play(0, true); } }, { threshold: 0.3 });
    if (still()) { seen.current = true; play(2, false); } // reduced motion: show a finished step instead of animating
    else io.observe(el);
    return () => { io.disconnect(); run.current++; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (seen.current) play(step, false); }, [pm, id]); // eslint-disable-line react-hooks/exhaustive-deps
  const appLook = view === 3 ? next : look;
  const demo = useDemo(view === 0 ? "uix" : appLook.id);
  return (
    <section className="sec" id="start">
      <Head center eyebrow="Get started" title="From an empty folder to your brand" lead="Pick your package manager and framework. Every command updates to match, and you can watch each one run." />
      <div className={`console${paused ? " paused" : ""}`} ref={box}>
        <div className="con-top">
          <div className="pmtabs" role="tablist" aria-label="Package manager">{(Object.keys(PM) as PMId[]).map(k => <button key={k} type="button" role="tab" aria-label={k} aria-selected={pm === k} onClick={() => setPm(k)} style={{ ["--c" as any]: PM[k].h === "#000000" ? "#FBF0DF" : PM[k].h }}><Logo m={PM[k]} size={18} /><span>{k}</span></button>)}</div>
          <div className="fwchips" role="group" aria-label="Framework">{(Object.keys(FW) as FWId[]).map(k => <button key={k} type="button" aria-pressed={fw === k} onClick={() => { setFw(k); setTimeout(() => play(0, false)); }}><Logo m={FW[k]} size={15} />{CREATE[k].name}</button>)}</div>
        </div>
        <div className="con-body">
          <ol className="csteps">{steps.map((st, i) => (
            <li key={i} className={`cstep${i < step ? " done" : ""}`} aria-current={i === step ? "step" : undefined} onClick={e => { if (!(e.target as HTMLElement).closest("button[data-copy]")) play(i, !paused); }} style={{ ["--dur" as any]: still() ? "0s" : "5.2s" }}>
              <span className="cnum">{i + 1}</span><button type="button" className="ctitle">{st.t}</button><p>{st.d}</p>
              <div className="cline"><span>$</span><code>{st.cmd}</code><button type="button" data-copy onClick={() => copy(st.cmd)} aria-label={`Copy: ${st.cmd}`}>{done === st.cmd ? "Copied" : "Copy"}</button></div>
              <span className="cprog"><i key={`${i}-${step}-${term ? 1 : 0}`} /></span>
            </li>))}</ol>
          <div className="con-right">
            <div className="lterm"><div className="tb"><i /><i /><i />&nbsp;terminal · my-shop</div><pre aria-live="polite">{term}</pre></div>
            <div className="lapp"><div className="cw-bar"><i /><i /><i /><span>localhost:3000</span></div>
              <div className="lapp-body" {...demo}>
                {view === 0 && <div className="lapp-empty"><b style={{ fontSize: 18, color: "var(--ink)", fontWeight: 500 }}>my-shop</b><span>A fresh {fw === "react" ? "React" : c.name} app. No uix-ui yet.</span></div>}
                {view === 1 && <div className="lapp-empty"><b className="font-heading text-fg-primary" style={{ fontSize: 24, fontWeight: 600 }}>Shapla</b><span className="text-fg-secondary">Theme ready: {look.name}. No components yet.</span><span className="row" style={{ gap: 4 }}>{ramp(look.light).filter((_, k) => k % 2 === 0).map(col => <i key={col} style={{ width: 18, height: 8, borderRadius: 3, background: col }} />)}</span></div>}
                {view >= 2 && <>
                  <div style={{ ["--d" as any]: "0ms" }}><h4 className="text-heading-5 font-heading text-fg-primary">Welcome back</h4><p className="text-body-small text-fg-secondary">Wearing {appLook.name}</p></div>
                  <Card className="gap-3 p-5" style={{ ["--d" as any]: "140ms" }}><Input label="Email" defaultValue="nusrat@shapla.app" /><Switch label="Keep me signed in" defaultChecked /></Card>
                  <div className="row" style={{ ["--d" as any]: "280ms" }}><Button>Continue</Button><Button variant="outline">Cancel</Button><Badge color="success">Ready</Badge></div>
                </>}
              </div>
            </div>
          </div>
        </div>
        <div className="con-foot"><button type="button" className="btn b-brand" onClick={() => { setPaused(false); play(0, true); }}>Play all steps</button><button type="button" className="btn b-line" aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? "Resume" : "Pause"}</button><span className="note">Every file lands in your project. Nothing to keep in sync.</span></div>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="cta">
      <h2>Start building with your own design system</h2>
      <p>Free and open source. Copy in what you need today, bring your own brand when you're ready.</p>
      <div className="acts" style={{ justifyContent: "center" }}><Link className="btn b-brand lg" to="/docs/installation">Get started</Link><a className="btn b-line lg" href="https://github.com/mdrakibshekh/uix-ui">Star on GitHub</a></div>
      <Copy text="npx uix-ui@latest init" />
    </section>
  );
}
