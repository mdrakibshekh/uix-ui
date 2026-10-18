import * as React from "react";
import { Link, useRoute } from "../router";
import { byId, contrast, loadPreset, useCopy, usePreset } from "../lib";
import { LOOKS, fontsOf, loadFont, type Look } from "../home/brand";
import { Callout, Code, H2, Install, PageHeader, PrevNext } from "../site/Docs";
import { Alert } from "../components/ui/alert";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { Stat } from "../components/ui/stat";
import { Switch } from "../components/ui/switch";
import "./themes.css";

/* One theme: header, light and dark live previews, every colour ramp read from the browser, type, contrast, and how to use it. */

const RAMPS = ["primary", "secondary", "neutral", "success", "warning", "error"];
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const PAIRS: [string, string, string][] = [
  ["Main text on the page", "text-primary", "bg-canvas"],
  ["Secondary text on a card", "text-secondary", "bg-surface"],
  ["Text on a brand button", "text-on-brand", "bg-brand"],
  ["Brand-coloured text on the page", "text-brand", "bg-canvas"],
];
type Vals = { ramps: Record<string, string[]>; light: Record<string, string>; dark: Record<string, string> };

/** Any CSS colour as #rrggbb (the browser resolves it). */
function hexOf(col: string) { const c = document.createElement("canvas").getContext("2d")!; c.fillStyle = "#000"; c.fillStyle = col; return c.fillStyle; }
const ink = (bg: string) => (contrast("#FFFFFF", bg) >= contrast("#000000", bg) ? "#FFFFFF" : "#000000");

/** When the whole site is dark, the theme's dark rules also match the "light" preview. Copy the light rules with a higher specificity for it. */
function forceLight(id: string) {
  let css = "";
  const key = `[data-preset="${id}"]`;
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(rules)) {
      const t = r.cssText;
      if (t.startsWith("@layer") || !t.includes(key) || !t.includes("--") || /data-theme=("?)dark/.test(t)) continue;
      css += t.split(key).join(`${key}[data-pv="light"][data-pv="light"][data-pv="light"]`);
    }
  }
  let el = document.getElementById("th-force-light");
  if (!el) { el = document.createElement("style"); el.id = "th-force-light"; document.head.appendChild(el); }
  el.textContent = css;
}

function Screen() {
  return (
    <div className="th-scr">
      <div className="th-scr-top">
        <div><p className="th-scr-h">Good morning, Mira</p><p className="th-scr-s">Here is how Shapla Tea did this week.</p></div>
        <Avatar initials="MR" />
      </div>
      <div className="th-scr-stats">
        <Stat label="Revenue" value="৳48,200" delta="+12.5%" trend="up" />
        <Stat label="Orders" value="312" delta="-3.1%" trend="down" />
      </div>
      <Card className="th-scr-card">
        <Input label="Shop name" defaultValue="Shapla Tea" />
        <Switch label="Email me about new orders" defaultChecked />
        <Progress value={64} aria-label="Storage used" />
        <div className="th-scr-row"><Button>Save changes</Button><Button variant="outline">Cancel</Button><Badge color="success" dot>Live</Badge><Badge color="warning" appearance="outline">Draft</Badge></div>
      </Card>
      <Alert type="success" title="Payout sent">Your payout of ৳12,400 is on its way.</Alert>
    </div>
  );
}

function Detail({ look }: { look: Look }) {
  const { id: worn, set } = usePreset();
  const p = byId(look.id);
  const lightRef = React.useRef<HTMLDivElement>(null), darkRef = React.useRef<HTMLDivElement>(null), rampRef = React.useRef<HTMLDivElement>(null);
  const [vals, setVals] = React.useState<Vals | null>(null);
  const { copy, done } = useCopy();

  React.useEffect(() => {
    loadFont(look.display); loadFont(look.sans);
    let live = true, timer = 0;
    const read = (): boolean => {
      const l = lightRef.current, d = darkRef.current, r = rampRef.current;
      if (!l || !d || !r) return false;
      // Wait for the theme's own stylesheet: until then the page defaults answer.
      if (!document.querySelector<HTMLLinkElement>(`link[href$="themes/${look.id}.css"]`)?.sheet) return false;
      forceLight(look.id);
      const get = (el: Element, n: string) => getComputedStyle(el).getPropertyValue(`--${n}`).trim();
      if (!get(r, "color-primary-500")) return false;
      const ramps: Vals["ramps"] = {};
      RAMPS.forEach(n => { ramps[n] = STEPS.map(s => hexOf(get(r, `color-${n}-${s}`))); });
      const sem: Vals["light"] = {}, dk: Vals["dark"] = {};
      PAIRS.forEach(([, a, b]) => [a, b].forEach(n => { sem[n] = hexOf(get(l, n)); dk[n] = hexOf(get(d, n)); }));
      setVals({ ramps, light: sem, dark: dk });
      return true;
    };
    // The theme file may still be loading: try again until its variables show up.
    const tick = (n: number) => { if (live && !read() && n < 80) timer = window.setTimeout(() => tick(n + 1), 100); };
    loadPreset(look.id).then(() => tick(0));
    return () => { live = false; window.clearTimeout(timer); };
  }, [look.id, look.display, look.sans]);

  const i = LOOKS.findIndex(l => l.id === look.id), prev = LOOKS[i - 1], next = LOOKS[i + 1];
  const pass = (a: string, b: string, v: Record<string, string>) => (v[a] && v[b] ? contrast(v[a], v[b]) : 0);
  const rows = PAIRS.map(([label, a, b]) => ({ label, a, b, l: vals ? pass(a, b, vals.light) : 0, d: vals ? pass(a, b, vals.dark) : 0 }));
  const cell = (n: number) => (vals ? <><span className={n >= 4.5 ? "th-ok" : "th-bad"}><span aria-hidden>{n >= 4.5 ? "✓ " : "✕ "}</span>{n >= 4.5 ? "Pass" : "Fail"}</span> · {n.toFixed(2)}:1</> : "…");
  const chips = (v: Record<string, string> | undefined, a: string, b: string) => v ? <span className="chips" aria-hidden><i style={{ background: v[b] }} /><i style={{ background: v[a] }} /></span> : null;
  const css = `/* Tokens from the ${look.name} theme */
.panel {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
}
.panel h2 { font-family: var(--font-heading); }
.panel .cta {
  background: var(--bg-brand);
  color: var(--text-on-brand);
}
.panel .cta:hover { background: var(--bg-brand-hover); }`;
  const toc = (idn: string, label: string) => <H2 id={idn}>{label}</H2>;

  return (
    <main className="wrap th-page" id="content">
      <PageHeader crumbs={[{ label: "Themes", to: "/themes" }, { label: look.name, to: `/themes/${look.id}` }]} title={look.name} lead={p.summary}>
        <button type="button" className="btn b-brand th-wearbtn" aria-pressed={worn === look.id} onClick={() => set(look.id)}>Wear on this site</button>
        <Link className="btn b-line" to="/themes">All themes</Link>
      </PageHeader>
      <dl className="th-meta">
        <div><dt>Fonts</dt><dd>{fontsOf(look)}</dd></div>
        <div><dt>Corner radius</dt><dd>{look.radius} px</dd></div>
        <div><dt>Made for</dt><dd className="cap">{p.industries.map(x => x.replace(/-/g, " ")).slice(0, 3).join(", ")}</dd></div>
        <div><dt>Mood</dt><dd className="cap">{p.moods.map(x => x.replace(/-/g, " ")).join(", ")}</dd></div>
      </dl>
      <Install cmd={run => `${run} uix-ui@latest theme ${look.id}`} />

      <div className="th-pvs" aria-label={`${look.name} in light and dark`}>
        <div className="th-pvwrap"><span className="th-pvlabel">Light</span><div className="th-pv" data-preset={look.id} data-pv="light" ref={lightRef}><Screen /></div></div>
        <div className="th-pvwrap"><span className="th-pvlabel">Dark</span><div className="th-pv" data-preset={look.id} data-theme="dark" ref={darkRef}><Screen /></div></div>
      </div>

      <section data-preset={look.id} ref={rampRef} aria-label="Colours">
        {toc("colours", "Colours")}
        <p className="th-lead">Six ramps from light (50) to dark (950). Click a swatch to copy its hex code.</p>
        <div style={{ marginTop: 16 }}>
          {RAMPS.map(n => (
            <div className="th-ramp" key={n}>
              <h3>{n}</h3>
              <div className="th-sw">
                {STEPS.map((s, k) => {
                  const hex = vals?.ramps[n][k];
                  return (
                    <button key={s} type="button" onClick={() => hex && copy(hex)} aria-label={`${n} ${s}${hex ? `, ${hex}. Copy` : ""}`} style={{ background: `var(--color-${n}-${s})`, color: hex ? ink(hex) : undefined }}>
                      <b>{s}</b><span>{hex ? (done === hex ? "Copied" : hex.toUpperCase()) : " "}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section data-preset={look.id}>
        {toc("type", "Type")}
        <div className="th-type">
          <div className="th-tcard">
            <h3>Display · <b>{look.display}</b></h3>
            <p className="th-aa th-d" aria-hidden>Aa</p>
            <p className="s1 th-d" style={{ fontWeight: 600 }}>Good tea, delivered fresh</p>
            <p className="s2 th-d" style={{ fontWeight: 500 }}>Orders, stock and payouts</p>
            <p className="s3 th-d" style={{ fontWeight: 500 }}>Everything a small shop needs</p>
            <p className="set th-d">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
          </div>
          <div className="th-tcard">
            <h3>Body · <b>{look.sans}</b></h3>
            <p className="th-aa th-b" aria-hidden>Aa</p>
            <p className="b1 th-b">Pay monthly, cancel any time. Your first order ships the same day.</p>
            <p className="b2 th-b">Pay monthly, cancel any time. Your first order ships the same day.</p>
            <p className="b3 th-b">Pay monthly, cancel any time. Your first order ships the same day.</p>
            <p className="set th-b">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
          </div>
        </div>
      </section>

      <section>
        {toc("contrast", "Contrast")}
        <p className="th-lead">The pairs you use most, measured with the WCAG formula. Normal text needs 4.5:1 to pass AA.</p>
        <div className="dtable th-ct" role="region" aria-label="Contrast of key colour pairs" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Pair</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.label}>
                  <th scope="row" style={{ fontWeight: 500, textAlign: "left" }}>{r.label}<br /><code>{r.a}</code> on <code>{r.b}</code></th>
                  <td>{chips(vals?.light, r.a, r.b)}{cell(r.l)}</td>
                  <td>{chips(vals?.dark, r.a, r.b)}{cell(r.d)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        {toc("use", "Use it")}
        <p className="th-lead">One command adds the theme to your project. After that, every colour, font and radius is a token you can use anywhere.</p>
        <Install cmd={run => `${run} uix-ui@latest theme ${look.id}`} />
        <Code lang="css" file="styles.css" code={css} />
        <Callout>In dark mode the same token names carry the dark colours, so this CSS needs no changes.</Callout>
      </section>

      <PrevNext prev={prev && { label: prev.name, to: `/themes/${prev.id}` }} next={next && { label: next.name, to: `/themes/${next.id}` }} />
    </main>
  );
}

export default function ThemePage() {
  const { id } = useRoute().params;
  const look = LOOKS.find(l => l.id === id);
  if (look) return <Detail key={look.id} look={look} />;
  return (
    <main className="wrap th-page" id="content">
      <PageHeader crumbs={[{ label: "Themes", to: "/themes" }]} title="We could not find that theme" lead={`There is no theme called “${id}”. It may have been renamed.`}>
        <Link className="btn b-brand" to="/themes">See all themes</Link>
      </PageHeader>
    </main>
  );
}
