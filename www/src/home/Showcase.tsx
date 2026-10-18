import * as React from "react";
import { usePreset, useCopy } from "../lib";
import { Link } from "../router";
import { SCENES } from "../Studio";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { OtpInput } from "../components/ui/otp-input";
import { Alert } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tooltip } from "../components/ui/tooltip";
import { Accordion, AccordionItem } from "../components/ui/accordion";
import { Avatar } from "../components/ui/avatar";
import { AvatarGroup } from "../components/ui/avatar-group";
import { Skeleton } from "../components/ui/skeleton";
import { DatePicker } from "../components/ui/date-picker";
import { SearchField } from "../components/ui/search-field";
import { Kbd } from "../components/ui/kbd";
import { lookById } from "./brand";
import { useDemo } from "./look";
import { Head } from "./bits";

/* ---------------- examples: the six real screens ---------------- */
export function Examples() {
  const [scene, setScene] = React.useState(SCENES[0].id);
  const { id } = usePreset();
  const demo = useDemo();
  const s = SCENES.find(x => x.id === scene) ?? SCENES[0];
  return (
    <section className="sec" id="examples">
      <Head eyebrow="Examples" title="Real screens, only uix-ui components" lead="Every screen below is built from the components on this site, wearing the theme you picked. Click, type and open things." />
      <div className="exbar">
        <div className="tabs" role="tablist" aria-label="Examples">
          {SCENES.map(x => <button key={x.id} type="button" role="tab" aria-selected={x.id === scene} aria-controls="ex-stage" onClick={() => setScene(x.id)}>{x.name}</button>)}
        </div>
        <div className="exmeta">Wearing <b>{lookById(id).name}</b> · <Link to="/examples">Open full screen</Link></div>
      </div>
      <div className="frame" {...demo}>
        <div className="cw-bar"><i /><i /><i /><span>{s.url}</span><span style={{ marginLeft: "auto" }}>{s.note}</span></div>
        <div className="stage-body" id="ex-stage" role="tabpanel" aria-label={`${s.name} example`}><div className="scene-anim" key={s.id}><s.C /></div></div>
      </div>
      <p className="excap">Components in this screen: {s.slugs.map((slug, i) => <React.Fragment key={slug}>{i ? ", " : ""}<Link to={`/components/${slug}`}>{slug.replace(/-/g, " ")}</Link></React.Fragment>)}.</p>
    </section>
  );
}

/* ---------------- gallery: live tiles with a code peek ---------------- */
function Tile({ slug, name, sub, cat, wide, tall, code, children }: { slug: string; name: string; sub: string; cat: string; wide?: boolean; tall?: boolean; code: string; children: React.ReactNode }) {
  const [peek, setPeek] = React.useState(false);
  const { copy, done } = useCopy();
  const cmd = `npx uix-ui add ${slug}`;
  return (
    <div className={`tile${wide ? " w2" : ""}${tall ? " tall" : ""}`} data-c={cat}>
      {peek ? <pre className="peek" tabIndex={0} aria-label={`${name} code`}>{code}{"\n\n"}<span className="cm">$ {cmd}</span></pre> : <div className="pv">{children}</div>}
      <div className="nm">
        <Link to={`/components/${slug}`}><b>{name}</b></Link><span>{sub}</span>
        <button type="button" aria-pressed={peek} onClick={() => setPeek(p => !p)}>Code</button>
        <button type="button" onClick={() => copy(cmd)} aria-label={`Copy: ${cmd}`}>{done === cmd ? "Copied" : "Copy add"}</button>
      </div>
    </div>
  );
}

const CMDS = [["Calendar", "⌘C"], ["Search orders", "⌘O"], ["Customers", "⌘U"], ["Settings", "⌘,"], ["Switch to dark mode", ""], ["Wear Lagoon Stretch", ""]];
function CommandTile() {
  const [q, setQ] = React.useState(""), [i, setI] = React.useState(0);
  const list = CMDS.filter(c => c[0].toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="cmdk bg-surface text-fg-primary" data-kind="overlay" onKeyDown={e => { if (e.key === "ArrowDown") { e.preventDefault(); setI(x => (x + 1) % Math.max(1, list.length)); } if (e.key === "ArrowUp") { e.preventDefault(); setI(x => (x - 1 + list.length) % Math.max(1, list.length)); } }}>
      <SearchField placeholder="Type a command or search…" aria-label="Search commands" value={q} onChange={e => { setQ((e.target as HTMLInputElement).value); setI(0); }} />
      <ul role="listbox" aria-label="Commands">{list.map((c, k) => <li key={c[0]} role="option" aria-selected={k === i} className={k === i ? "on" : ""} onPointerEnter={() => setI(k)}>{c[0]}{c[1] && <Kbd size="sm">{c[1]}</Kbd>}</li>)}{!list.length && <li>No results</li>}</ul>
    </div>
  );
}

function TabsTile() {
  const [v, setV] = React.useState("account");
  return <Tabs value={v} onValueChange={setV} appearance="pill"><TabsList><TabsTrigger value="account">Account</TabsTrigger><TabsTrigger value="password">Password</TabsTrigger></TabsList><TabsContent value="account"><p className="sr">Account settings</p></TabsContent><TabsContent value="password"><p className="sr">Password settings</p></TabsContent></Tabs>;
}

function UploadTile() {
  const [v, setV] = React.useState(30);
  const run = () => { setV(0); let n = 0; const t = setInterval(() => { n += 10; setV(n); if (n >= 100) clearInterval(t); }, 120); };
  return <div style={{ display: "grid", gap: 10, width: 210 }}><Progress value={v} aria-label="Upload" /><Button size="sm" variant="outline" onClick={run}>Upload</Button></div>;
}

function AlertTile() {
  const [open, setOpen] = React.useState(true);
  return open ? <Alert type="success" title="Payment received" onClose={() => setOpen(false)} style={{ maxWidth: 260 }}>Order #2841 is ready to ship.</Alert> : <Button size="sm" variant="outline" onClick={() => setOpen(true)}>Show the alert again</Button>;
}

function SaveTile() {
  const [busy, setBusy] = React.useState(false);
  return <div className="row"><Button size="sm" loading={busy} onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1200); }}>{busy ? "Saving" : "Save"}</Button><Button size="sm" variant="outline">Cancel</Button></div>;
}

const FILTERS = [["all", "All"], ["forms", "Forms"], ["feedback", "Feedback"], ["display", "Data display"], ["nav", "Navigation"], ["overlays", "Overlays"]];
export function Gallery() {
  const demo = useDemo();
  const [f, setF] = React.useState("all");
  const show = (c: string) => f === "all" || f === c;
  const tiles: React.ReactElement[] = [
    <Tile key="cp" slug="command-palette" name="Command palette" sub="Overlays" cat="overlays" wide tall code={`<CommandPalette\n  open={open}\n  onClose={close}\n  groups={groups}\n/>`}><CommandTile /></Tile>,
    <Tile key="dp" slug="date-picker" name="Date picker" sub="Forms" cat="forms" tall code={`<DatePicker\n  type="range"\n  value={range}\n  onValueChange={setRange}\n/>`}><DatePicker type="range" month={new Date(2026, 9, 1)} defaultValue={{ from: new Date(2026, 9, 9), to: new Date(2026, 9, 13) }} /></Tile>,
    <Tile key="bt" slug="button" name="Button" sub="7 variants" cat="forms" code={`<Button>Save</Button>\n<Button variant="outline">\n  Cancel\n</Button>`}><SaveTile /></Tile>,
    <Tile key="in" slug="input" name="Input" sub="Forms" cat="forms" code={`<Input\n  label="Email"\n  placeholder="you@shapla.app"\n/>`}><Input placeholder="you@shapla.app" aria-label="Email" style={{ width: 220 }} /></Tile>,
    <Tile key="sw" slug="switch" name="Switch" sub="Forms" cat="forms" code={`<Switch\n  label="Notifications"\n  defaultChecked\n/>`}><Switch label="Notifications" defaultChecked /></Tile>,
    <Tile key="tb" slug="tabs" name="Tabs" sub="Navigation" cat="nav" code={`<Tabs defaultValue="account">\n  <TabsList>\n    <TabsTrigger value="account">Account</TabsTrigger>\n    <TabsTrigger value="password">Password</TabsTrigger>\n  </TabsList>\n</Tabs>`}><TabsTile /></Tile>,
    <Tile key="sl" slug="slider" name="Slider" sub="Forms" cat="forms" code={`<Slider\n  defaultValue={60}\n  aria-label="Volume"\n/>`}><div style={{ width: 200 }}><Slider defaultValue={60} aria-label="Volume" /></div></Tile>,
    <Tile key="cb" slug="checkbox" name="Checkbox" sub="Forms" cat="forms" code={`<Checkbox label="Email me" defaultChecked />\n<Checkbox label="Text me" />`}><div style={{ display: "grid", gap: 8 }}><Checkbox label="Email me" defaultChecked /><Checkbox label="Text me" /></div></Tile>,
    <Tile key="otp" slug="otp-input" name="OTP input" sub="Forms" cat="forms" code={`<OtpInput\n  length="6"\n  onComplete={verify}\n/>`}><OtpInput aria-label="One-time code" /></Tile>,
    <Tile key="al" slug="alert" name="Alert" sub="Feedback" cat="feedback" code={`<Alert\n  type="success"\n  title="Payment received"\n  onClose={hide}\n>\n  Order #2841 is ready to ship.\n</Alert>`}><AlertTile /></Tile>,
    <Tile key="pr" slug="progress" name="Progress" sub="Feedback" cat="feedback" code={`<Progress\n  value={64}\n  aria-label="Upload"\n/>`}><UploadTile /></Tile>,
    <Tile key="bd" slug="badge" name="Badge" sub="Data display" cat="display" code={`<Badge color="success">Paid</Badge>\n<Badge>Draft</Badge>`}><div className="row" style={{ flexWrap: "wrap", justifyContent: "center" }}><Badge color="success">Paid</Badge><Badge>Draft</Badge><Badge color="brand" appearance="solid">Shipped</Badge></div></Tile>,
    <Tile key="tt" slug="tooltip" name="Tooltip" sub="Overlays" cat="overlays" code={`<Tooltip content="Copy link">\n  <Button variant="outline">Share</Button>\n</Tooltip>`}><Tooltip content="Copy link"><Button size="sm" variant="outline">Share</Button></Tooltip></Tile>,
    <Tile key="ac" slug="accordion" name="Accordion" sub="Data display" cat="display" code={`<Accordion>\n  <AccordionItem title="Is it free?">\n    Yes, MIT licensed.\n  </AccordionItem>\n</Accordion>`}><div style={{ width: 230 }}><Accordion><AccordionItem title="Is it free?" open>Yes, MIT licensed.</AccordionItem><AccordionItem title="Dark mode?">Every theme has it.</AccordionItem></Accordion></div></Tile>,
    <Tile key="ag" slug="avatar-group" name="Avatar group" sub="Data display" cat="display" code={`<AvatarGroup max={3}>\n  <Avatar initials="NJ" />\n  <Avatar initials="IJ" />\n</AvatarGroup>`}><AvatarGroup max={3}><Avatar initials="NJ" /><Avatar initials="IJ" /><Avatar initials="RS" /><Avatar initials="AK" /><Avatar initials="MT" /></AvatarGroup></Tile>,
    <Tile key="sk" slug="skeleton" name="Skeleton" sub="Feedback" cat="feedback" code={`<Skeleton type="list-item" />`}><div style={{ width: 220, display: "grid", gap: 10 }}><Skeleton type="list-item" /><Skeleton type="text" /></div></Tile>,
  ];
  return (
    <section className="sec" id="gallery">
      <Head title="Components" lead="64 components. Every tile below is the real thing: click it, type in it, then open its code or copy its install command.">
        <Link className="btn b-line" to="/components">View all 64</Link>
      </Head>
      <div className="filters" role="group" aria-label="Filter components">{FILTERS.map(([k, n]) => <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}>{n}</button>)}</div>
      <div className="grid" {...demo}>{tiles.filter(t => show((t.props as any).cat))}</div>
    </section>
  );
}
