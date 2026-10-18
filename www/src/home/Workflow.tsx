import * as React from "react";
import { Link } from "../router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Plus } from "../components/ui/icons";
import { lookById } from "./brand";
import { useDemo } from "./look";
import { Head } from "./bits";
import { still } from "./Hero";

type V = "primary" | "soft" | "outline" | "ghost";
type S = "sm" | "md" | "lg";
const cap = (w: string) => w[0].toUpperCase() + w.slice(1);
const Seg = <T extends string>({ label, opts, value, onPick }: { label: string; opts: T[]; value: T; onPick: (v: T) => void }) => (
  <div><h6>{label}</h6><span className="segm" role="group" aria-label={label}>{opts.map(o => <button key={o} type="button" aria-pressed={value === o} onClick={() => onPick(o)}>{cap(o)}</button>)}</span></div>
);

function FigmaPane() {
  const demo = useDemo();
  const [v, setV] = React.useState<V>("primary"), [s, setS] = React.useState<S>("md"), [icon, setIcon] = React.useState(false);
  const [hot, setHot] = React.useState<{ k: string; n: number } | null>(null);
  const pick = (k: string, f: () => void) => { f(); setHot(h => ({ k, n: (h?.n ?? 0) + 1 })); };
  // The line that changed flashes; a new key replays the flash on every pick.
  const line = (k: string, body: React.ReactNode) => <span className={hot?.k === k ? "chg" : undefined} key={`${k}-${hot?.k === k ? hot.n : 0}`}>  {body}{"\n"}</span>;
  return (
    <div className="wpane on">
      <div className="figwin">
        <div className="cw-bar"><i /><i /><i /><span>Shapla · Design system (UIX for Figma)</span></div>
        <div className="fig-body">
          <aside className="fig-layers"><h6>Layers</h6><span className="on">Button / {cap(v)} / {s}</span><span>Input / Outline / Default</span><span>Badge / Success / Subtle</span><span>Switch / md / On</span><span>Tabs / Pill</span><span>Card / Elevated</span></aside>
          <div className="fig-canvas" {...demo}><div className="fig-sel"><i /><i /><i /><i /><span className="fig-tag">Button</span><Button variant={v} size={s} leadingIcon={icon ? <Plus /> : undefined}>Save changes</Button></div></div>
          <aside className="fig-props">
            <Seg label="Variant" opts={["primary", "soft", "outline", "ghost"] as V[]} value={v} onPick={x => pick("v", () => setV(x))} />
            <Seg label="Size" opts={["sm", "md", "lg"] as S[]} value={s} onPick={x => pick("s", () => setS(x))} />
            <div><h6>Leading icon</h6><span className="segm" role="group" aria-label="Leading icon"><button type="button" aria-pressed={!icon} onClick={() => pick("i", () => setIcon(false))}>Off</button><button type="button" aria-pressed={icon} onClick={() => pick("i", () => setIcon(true))}>On</button></span></div>
          </aside>
        </div>
      </div>
      <div className="codewin">
        <div className="cw-bar"><i /><i /><i /><span>settings.tsx</span></div>
        <pre tabIndex={0} aria-label="Matching code"><span className="k">import</span> {"{ Button }"} <span className="k">from</span> <span className="str">"@/components/ui/button"</span>;{"\n"}{icon && <><span className="k">import</span> {"{ Plus }"} <span className="k">from</span> <span className="str">"@/components/ui/icons"</span>;{"\n"}</>}{"\n"}<span className="t">{"<Button"}</span>{"\n"}
          {line("v", <><span className="a">variant</span>=<span className="str">"{v}"</span></>)}
          {line("s", <><span className="a">size</span>=<span className="str">"{s}"</span></>)}
          {icon && line("i", <><span className="a">leadingIcon</span>={"{"}<span className="t">{"<Plus />"}</span>{"}"}</>)}
          <span className="t">{">"}</span>{"\n"}  Save changes{"\n"}<span className="t">{"</Button>"}</span></pre>
        <p className="cw-note">Same names on both sides. What a designer picks in Figma is the prop a developer writes. Try the properties on the left.</p>
      </div>
    </div>
  );
}

type Line = { kind: "bub" | "tool" | "say"; text: React.ReactNode; done?: React.ReactNode };
function AgentPane() {
  const lg = lookById("lagoon-stretch");
  const demo = useDemo("lagoon-stretch");
  const [log, setLog] = React.useState<Line[]>([]), [typed, setTyped] = React.useState(""), [parts, setParts] = React.useState(0);
  const run = React.useRef(0);
  const play = React.useCallback(async () => {
    const my = ++run.current, wait = (ms: number) => new Promise(r => setTimeout(r, still() ? 0 : ms)), live = () => my === run.current;
    const ask = "Build a settings page with uix-ui and the lagoon-stretch theme.";
    setLog([]); setParts(0);
    for (let i = 1; i <= ask.length && !still(); i += 2) { if (!live()) return; setTyped(ask.slice(0, i)); await wait(22); }
    setTyped(""); setLog([{ kind: "bub", text: ask }]);
    const steps: [React.ReactNode, React.ReactNode, number][] = [
      ["Searching UIX themes…", <>Found <b style={{ fontWeight: 500 }}>Lagoon Stretch</b>, made for {lg.industry}</>, 900],
      ["Reading its tokens…", <code>{lg.display} + {lg.sans} · radius {lg.radius} px · light and dark</code>, 900],
      ["Adding components…", <code>npx uix-ui add card input switch button</code>, 1000],
    ];
    for (const [a, b, ms] of steps) { if (!live()) return; setLog(l => [...l, { kind: "tool", text: a }]); await wait(ms); if (!live()) return; setLog(l => l.map((x, i) => (i === l.length - 1 ? { ...x, done: b } : x))); }
    setLog(l => [...l, { kind: "tool", text: "Writing src/app/settings.tsx" }]);
    for (let k = 1; k <= 4; k++) { if (!live()) return; setParts(k); await wait(420); }
    setLog(l => l.map((x, i) => (i === l.length - 1 ? { ...x, done: "Wrote src/app/settings.tsx" } : x)));
    await wait(300); if (live()) setLog(l => [...l, { kind: "say", text: "Done. The page uses your uix-ui components and the Lagoon Stretch tokens, so there are no hard-coded colours." }]);
  }, [lg]);
  React.useEffect(() => { play(); return () => { run.current++; }; }, [play]);
  return (
    <div className="wpane on">
      <div className="chat">
        <div className="cw-bar"><i /><i /><i /><span>Claude Code · uix MCP connected</span></div>
        <div className="chat-log" aria-live="polite">{log.map((l, i) => l.kind === "bub" ? <div key={i} className="bub">{l.text}</div> : l.kind === "say" ? <div key={i} className="say">{l.text}</div> : <div key={i} className="tool">{l.done ? <i className="ok">✓</i> : <i className="run" />}<span>{l.done ?? l.text}</span></div>)}</div>
        <div className="chat-in"><span style={typed ? { color: "var(--ink)" } : undefined}>{typed || "Ask your agent…"}</span><button type="button" className="btn b-line sm" onClick={play}>Replay</button></div>
      </div>
      <div className="ai-out">
        <div className="cw-bar"><i /><i /><i /><span>localhost:5173/settings</span></div>
        <div className="ai-res" {...demo}>
          {!parts && <div className="lapp-empty">The page your agent writes shows up here.</div>}
          {parts >= 1 && <div><h4 className="text-heading-5 font-heading text-fg-primary">Settings</h4><p className="text-body-small text-fg-secondary">Shop details and notifications</p></div>}
          {parts >= 2 && <Card className="gap-3 p-5"><Input label="Shop name" defaultValue="Shapla Tea House" /><Input label="Support email" defaultValue="hello@shapla.app" /></Card>}
          {parts >= 3 && <Card className="gap-3 p-5"><Switch label="Email me for every order" defaultChecked /><Switch label="Weekly summary on Fridays" /></Card>}
          {parts >= 4 && <div className="row" style={{ justifyContent: "flex-end" }}><Button variant="outline">Cancel</Button><Button>Save changes</Button></div>}
        </div>
      </div>
    </div>
  );
}

export function Workflow() {
  const [tab, setTab] = React.useState<"fig" | "ai">("fig");
  return (
    <section className="sec" id="workflow">
      <Head center eyebrow="Works where you work" title="One system, from Figma to your agent" lead="Designers keep working in Figma, agents keep working in your editor, and both use the same names and tokens as your code." />
      <div style={{ display: "flex", justifyContent: "center", marginTop: -8, marginBottom: 24 }}>
        <div className="wtabs" role="tablist" aria-label="Workflow"><button type="button" role="tab" aria-selected={tab === "fig"} onClick={() => setTab("fig")}>Figma ↔ Code</button><button type="button" role="tab" aria-selected={tab === "ai"} onClick={() => setTab("ai")}>AI agent</button></div>
      </div>
      <div className="wstage">{tab === "fig" ? <FigmaPane /> : <AgentPane />}</div>
      <div className="wfoot"><a className="btn b-line" href="https://uixdesign.pagestro.com/">Visit UIX for Figma →</a><Link className="btn b-ghost" to="/docs/mcp">Set up the MCP server</Link></div>
    </section>
  );
}
