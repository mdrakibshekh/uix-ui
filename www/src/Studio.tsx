import * as React from "react";
import { FREE, PRO, byId, usePreset, useCopy } from "./lib";
import { useToast } from "./toast";
import { ISearch, ISun, IMoon } from "./site-icons";
import { Button } from "./components/ui/button";
import { IconButton } from "./components/ui/icon-button";
import { Toggle, ToggleGroup } from "./components/ui/toggle";
import { Chip } from "./components/ui/chip";
import { Rating } from "./components/ui/rating";
import { Input } from "./components/ui/input";
import { Select } from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { Combobox } from "./components/ui/combobox";
import { Checkbox } from "./components/ui/checkbox";
import { Switch } from "./components/ui/switch";
import { Slider } from "./components/ui/slider";
import { Segmented } from "./components/ui/segmented";
import { NumberInput } from "./components/ui/number-input";
import { OtpInput } from "./components/ui/otp-input";
import { TagInput } from "./components/ui/tag-input";
import { DatePicker } from "./components/ui/date-picker";
import { FileUpload } from "./components/ui/file-upload";
import { SelectionCard } from "./components/ui/selection-card";
import { Modal } from "./components/ui/modal";
import { Drawer } from "./components/ui/drawer";
import { Sheet } from "./components/ui/sheet";
import { CommandPalette } from "./components/ui/command-palette";
import { Popover } from "./components/ui/popover";
import { Menu, MenuItem, MenuSeparator } from "./components/ui/menu";
import { Tooltip } from "./components/ui/tooltip";
import { Alert } from "./components/ui/alert";
import { Banner } from "./components/ui/banner";
import { Progress } from "./components/ui/progress";
import { ProgressCircle } from "./components/ui/progress-circle";
import { Spinner } from "./components/ui/spinner";
import { Skeleton } from "./components/ui/skeleton";
import { EmptyState } from "./components/ui/empty-state";
import { Notification } from "./components/ui/notification";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Breadcrumb } from "./components/ui/breadcrumb";
import { Pagination } from "./components/ui/pagination";
import { Stepper, Step } from "./components/ui/stepper";
import { Tree, TreeItem } from "./components/ui/tree-view";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./components/ui/table";
import { Chart } from "./components/ui/chart";
import { Stat } from "./components/ui/stat";
import { Badge } from "./components/ui/badge";
import { Avatar } from "./components/ui/avatar";
import { AvatarGroup } from "./components/ui/avatar-group";
import { Timeline, TimelineItem } from "./components/ui/timeline";
import { Accordion, AccordionItem } from "./components/ui/accordion";
import { Kbd } from "./components/ui/kbd";
import { CodeBlock } from "./components/ui/code-block";
import { ListItem } from "./components/ui/list-item";
import { Card } from "./components/ui/card";
import { Plus, Star, Copy, Upload, X, File, Folder, ChevronDown, Info, User, Zap, Search, Clock, Megaphone, Inbox, CircleCheck } from "./components/ui/icons";

/* ================================================================== inspector
   Every uix-ui component root carries data-slot="<name>". Hovering one shows its name and install command,
   like Figma's dev mode; "X-ray" outlines them all. */
const PART_OF: Record<string, string> = { "menu-item": "menu", "tree-item": "tree-view", sidebar: "sidebar-item" };
const SKIP = new Set(["icon", "count", "action", "trend", "description", "title", "arrow"]);
const slugOf = (el: Element | null, root: Element): { el: Element; slug: string } | null => {
  while (el && el !== root) {
    const s = el.getAttribute("data-slot");
    if (s && !SKIP.has(s)) return { el, slug: PART_OF[s] ?? s };
    el = el.parentElement;
  }
  return null;
};
const label = (slug: string) => slug.split("-").map((w, i) => (w === "otp" ? "OTP" : i ? w : w[0].toUpperCase() + w.slice(1))).join(" ");
type Box = { x: number; y: number; w: number; h: number; slug: string };
const boxOf = (el: Element, root: Element, slug: string): Box => {
  const a = el.getBoundingClientRect(), b = root.getBoundingClientRect();
  return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height, slug };
};

function Inspector({ root, xray, focus }: { root: React.RefObject<HTMLDivElement>; xray: boolean; focus: string | null }) {
  const [hover, setHover] = React.useState<Box | null>(null);
  const [all, setAll] = React.useState<Box[]>([]);
  const { copy, done } = useCopy();
  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      if ((e.target as Element).closest(".insp-tag")) return;
      const hit = slugOf(e.target as Element, el);
      setHover(hit ? boxOf(hit.el, el, hit.slug) : null);
    };
    const leave = () => setHover(null);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [root]);
  // X-ray and chip focus: outline every matching component, kept in place while the scene changes.
  React.useEffect(() => {
    const el = root.current;
    if (!el || (!xray && !focus)) { setAll([]); return; }
    const scan = () => {
      const seen = new Set<Element>();
      const out: Box[] = [];
      el.querySelectorAll("[data-slot]").forEach(n => {
        const hit = slugOf(n, el);
        if (!hit || seen.has(hit.el) || hit.el.closest("dialog")) return;
        seen.add(hit.el);
        if (focus && hit.slug !== focus) return;
        if (!focus && hit.el.parentElement?.closest("[data-slot]") && el.contains(hit.el.parentElement.closest("[data-slot]"))) return;
        const b = boxOf(hit.el, el, hit.slug);
        if (b.w > 4 && b.h > 4) out.push(b);
      });
      setAll(out);
    };
    scan();
    const t = setInterval(scan, 400);
    return () => clearInterval(t);
  }, [root, xray, focus]);
  const cmd = hover ? `npx uix-ui add ${hover.slug}` : "";
  return (
    <div className="insp" aria-hidden={!hover}>
      {all.map((b, i) => <div key={i} className={`insp-all${focus ? " on" : ""}`} style={{ transform: `translate(${b.x}px, ${b.y}px)`, width: b.w, height: b.h }}><span>{label(b.slug)}</span></div>)}
      {hover && (
        <>
          <div className="insp-box" style={{ transform: `translate(${hover.x}px, ${hover.y}px)`, width: hover.w, height: hover.h }} />
          <div className="insp-tag" style={{ transform: `translate(${hover.x}px, ${Math.max(0, hover.y - 38)}px)` }}>
            <b>{label(hover.slug)}</b>
            <button type="button" tabIndex={-1} onClick={() => copy(cmd)}>{done === cmd ? "Copied" : cmd}</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ================================================================== theme picker (custom dropdown) */
export const industry = (s = "") => s.split("-").map((w, i) => (w.length <= 3 && /^(ai|crm|web|b2b)$/.test(w) ? w.toUpperCase() : i ? w : w[0].toUpperCase() + w.slice(1))).join(" ");
export function ThemePicker() {
  const { id, set } = usePreset();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const wrap = React.useRef<HTMLDivElement>(null);
  const p = byId(id);
  React.useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); wrap.current?.querySelector<HTMLButtonElement>(".tp-btn")?.focus(); } };
    document.addEventListener("pointerdown", off);
    document.addEventListener("keydown", esc);
    setTimeout(() => wrap.current?.querySelector<HTMLInputElement>(".tp-search input")?.focus(), 30);
    return () => { document.removeEventListener("pointerdown", off); document.removeEventListener("keydown", esc); };
  }, [open]);
  const list = FREE.filter(x => (x.name + " " + x.moods.join(" ") + " " + x.industries.join(" ")).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="tp" ref={wrap}>
      <button type="button" className="tp-btn" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(o => !o)}>
        <i style={{ background: `conic-gradient(${p.light.primary} 0 50%, ${p.light.accent} 0 75%, ${p.light.muted} 0)` }} />
        <span><b>{p.name}</b><small>{[...new Set([p.fonts.display, p.fonts.sans])].join(" + ")}</small></span>
        <ChevronDown className="tp-chev" />
      </button>
      {open && (
        <div className="tp-panel" role="dialog" aria-label="Choose a theme">
          <label className="tp-search"><ISearch /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search 41 themes by name, mood or industry" aria-label="Search themes" /></label>
          <div className="tp-grid">
            {list.map(x => (
              <button key={x.id} type="button" className="tp-item" aria-pressed={x.id === id} onClick={() => { set(x.id); setOpen(false); }}>
                <span className="tp-sw" style={{ background: x.light.background }}>
                  <em style={{ background: x.light.primary, borderRadius: Math.min(x.radius, 10) }} />
                  <em style={{ background: x.light.accent, borderRadius: Math.min(x.radius, 10) }} />
                  <em style={{ background: x.dark.background, borderRadius: Math.min(x.radius, 10) }} />
                </span>
                <span className="tp-name">{x.name}</span>
                <span className="tp-meta">{industry(x.industries[0])}</span>
              </button>
            ))}
            {!list.length && <p className="tp-empty">No theme matches “{q}”.</p>}
          </div>
          <div className="tp-foot"><span>{PRO.length} more themes with UIX Pro</span><a href="#pricing" onClick={() => setOpen(false)}>See Pro →</a></div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== scenes */
const PRICE = { starter: 0, pro: 599, team: 1999 };
const CITIES = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh", "Cumilla", "Cox's Bazar"].map(c => ({ value: c.toLowerCase(), label: c }));

function Checkout() {
  const toast = useToast();
  const [email, setEmail] = React.useState("nusrat@shapla");
  const [plan, setPlan] = React.useState<keyof typeof PRICE>("pro");
  const [seats, setSeats] = React.useState(3);
  const [yearly, setYearly] = React.useState(true);
  const [storage, setStorage] = React.useState(40);
  const [agree, setAgree] = React.useState(true);
  const [paying, setPaying] = React.useState(false);
  const valid = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email);
  const total = Math.round((PRICE[plan] * seats + (storage > 50 ? 200 : 0)) * (yearly ? 10 : 1));
  return (
    <div className="sc-checkout">
      <div className="sc-col">
        <div className="sc-card">
          <h4 className="sc-h">Your details</h4>
          <Input label="Work email" type="email" value={email} onChange={e => setEmail(e.target.value)} error={valid ? undefined : "Add the domain ending, like .com"} helper={valid ? "We'll send the receipt here." : undefined} />
          <div className="sc-2">
            <Combobox label="City" options={CITIES} defaultValue="dhaka" placeholder="Type a city" />
            <Select label="Company size" defaultValue="11"><option value="1">Just me</option><option value="11">2 to 10 people</option><option value="50">11 to 50 people</option><option value="200">51 or more</option></Select>
          </div>
          <TagInput label="Invite teammates" defaultValue={["israt@shapla.app"]} helper="Press Enter after each email" />
          <div className="sc-2">
            <NumberInput label="Seats" value={seats} onValueChange={setSeats} min={1} max={50} />
            <Popover trigger={<Button variant="outline" leadingIcon={<Clock />} style={{ width: "100%", marginTop: 26 }}>Starts 16 Oct</Button>} title="Pick a start date" className="w-auto">
              <DatePicker month={new Date(2026, 9, 1)} defaultValue={{ from: new Date(2026, 9, 16) }} />
            </Popover>
          </div>
        </div>
        <div className="sc-card">
          <h4 className="sc-h">Verify your phone</h4>
          <p className="text-body-small text-fg-secondary">We sent a 6-digit code to +880 17•• •••• 21. Try 123456.</p>
          <OtpInput onComplete={v => toast(v === "123456" ? "Phone verified." : "That code doesn't match. Try 123456.", v === "123456" ? "success" : "error")} />
        </div>
      </div>
      <div className="sc-col">
        <div className="sc-card sc-summary">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <h4 className="sc-h">Plan</h4>
            <Segmented size="sm" value={yearly ? "y" : "m"} onValueChange={v => setYearly(v === "y")} options={[{ value: "m", label: "Monthly" }, { value: "y", label: "Yearly −17%" }]} />
          </div>
          {(["starter", "pro", "team"] as const).map(k => (
            <SelectionCard key={k} type="radio" name="sc-plan" checked={plan === k} onChange={() => setPlan(k)}
              title={k === "starter" ? "Starter" : k === "pro" ? "Pro" : "Team"} description={k === "starter" ? "1 system, community help" : k === "pro" ? "Every theme and block" : "Shared themes, roles"}
              price={PRICE[k] ? `৳${PRICE[k]}/seat` : "Free"} />
          ))}
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }} className="text-label-medium"><span>Extra storage</span><span className="text-fg-secondary">{storage} GB</span></div>
            <Slider value={storage} min={10} max={100} step={10} onChange={e => setStorage(Number(e.target.value))} aria-label="Extra storage" />
          </div>
          <Switch label="Send me a monthly invoice by email" defaultChecked />
          <div className="sc-total"><span>Total {yearly ? "per year" : "per month"}</span><b>৳{total.toLocaleString("en-IN")}</b></div>
          <Checkbox label="I agree to the terms" checked={agree} onChange={e => setAgree(e.target.checked)} />
          <Button size="lg" loading={paying} disabled={!agree || !valid} onClick={() => { setPaying(true); setTimeout(() => { setPaying(false); toast(`Paid ৳${total.toLocaleString("en-IN")}. Welcome aboard.`); }, 1500); }}>{paying ? "Paying" : `Pay ৳${total.toLocaleString("en-IN")}`}</Button>
        </div>
        <div className="sc-card">
          <h4 className="sc-h">Invoice details</h4>
          <Textarea label="Note on the invoice" defaultValue="Shapla Studio, House 12, Road 5, Dhanmondi, Dhaka" rows={2} />
          <FileUpload onFiles={f => toast(`Logo “${f[0]?.name}” added.`, "default")} helper="Logo for invoices: PNG or SVG" />
        </div>
      </div>
    </div>
  );
}

const FILES = [
  { n: "Brand kit", k: "Figma", c: "brand" as const, who: ["NJ", "IJ"] },
  { n: "Pricing page", k: "Draft", c: "warning" as const, who: ["RS"] },
  { n: "Mobile app", k: "Live", c: "success" as const, who: ["NJ", "RS", "TA"] },
  { n: "Invoices", k: "Archive", c: "neutral" as const, who: ["IJ"] },
  { n: "Onboarding", k: "Live", c: "success" as const, who: ["TA", "NJ"] },
  { n: "Launch post", k: "Draft", c: "warning" as const, who: ["RS", "IJ"] },
];
function Workspace() {
  const toast = useToast();
  const [sel, setSel] = React.useState("Mobile app");
  const [modal, setModal] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const [sheet, setSheet] = React.useState(false);
  const [cmd, setCmd] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  const [files, setFiles] = React.useState(FILES);
  const mref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!menu) return;
    const off = (e: PointerEvent) => { if (!mref.current?.contains(e.target as Node)) setMenu(false); };
    document.addEventListener("pointerdown", off);
    return () => document.removeEventListener("pointerdown", off);
  }, [menu]);
  const add = (n: string) => { setFiles(f => [{ n, k: "Draft", c: "warning" as const, who: ["RS"] }, ...f].slice(0, 6)); setSel(n); toast(`“${n}” created.`); };
  return (
    <div className="sc-workspace">
      <div className="sc-toolbar">
        <div ref={mref} style={{ position: "relative" }}>
          <Button leadingIcon={<Plus />} trailingIcon={<ChevronDown />} aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu(m => !m)}>New</Button>
          {menu && (
            <Menu style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: 220, zIndex: 20 }}>
              <MenuItem icon={<File />} shortcut="⌘N" onClick={() => { setMenu(false); add("Untitled file"); }}>File</MenuItem>
              <MenuItem icon={<Folder />} onClick={() => { setMenu(false); add("New folder"); }}>Folder</MenuItem>
              <MenuSeparator />
              <MenuItem icon={<Upload />} onClick={() => { setMenu(false); toast("Pick a file to upload.", "default"); }}>Upload…</MenuItem>
            </Menu>
          )}
        </div>
        <Button variant="soft" onClick={() => setCmd(true)}>Search <Kbd size="sm">⌘K</Kbd></Button>
        <span style={{ flex: 1 }} />
        <Popover trigger={<Button variant="outline">Share</Button>} title={`Share “${sel}”`} actions={<Button size="sm" onClick={() => toast("Invite sent to Israt.")}>Send invite</Button>}>
          <div style={{ display: "grid", gap: 10, paddingTop: 6 }}><Input size="sm" aria-label="Email" defaultValue="israt@shapla.app" /><Switch size="sm" label="Can edit" defaultChecked /></div>
        </Popover>
        <Tooltip content="Filters"><IconButton variant="outline" aria-label="Filters" onClick={() => setDrawer(true)}><Search /></IconButton></Tooltip>
        <Tooltip content="More actions"><IconButton variant="ghost" aria-label="More actions" onClick={() => setSheet(true)}><Star /></IconButton></Tooltip>
        <Tooltip content="Delete"><IconButton variant="ghost" aria-label="Delete" onClick={() => setModal(true)}><X /></IconButton></Tooltip>
      </div>
      <div className="sc-files">
        {files.map(f => (
          <button key={f.n} type="button" className="sc-file" aria-pressed={sel === f.n} onClick={() => setSel(f.n)}>
            <Card appearance={sel === f.n ? "elevated" : "outlined"} style={{ padding: 0, overflow: "hidden", height: "100%" }}>
              <span className="sc-file-art" aria-hidden><i /><i /><i /></span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px" }}>
                <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}><b className="text-label-large" style={{ display: "block" }}>{f.n}</b><span className="text-body-small text-fg-secondary">Edited today</span></span>
                <Badge size="sm" color={f.c}>{f.k}</Badge>
              </span>
              <span style={{ padding: "0 14px 12px", display: "flex" }}><AvatarGroup size="sm" max={3}>{f.who.map(w => <Avatar key={w} size="sm" initials={w} />)}</AvatarGroup></span>
            </Card>
          </button>
        ))}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} size="sm" headerIcon={<Info />} title={`Delete “${sel}”?`} footer={<><Button variant="ghost" onClick={() => setModal(false)}>Keep it</Button><Button variant="destructive" onClick={() => { setModal(false); setFiles(f => f.filter(x => x.n !== sel)); toast(`“${sel}” moved to the bin.`, "error"); }}>Delete</Button></>}>
        It stays in the bin for 30 days, then it's gone for good.
      </Modal>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Filters" footer={<><Button variant="ghost" onClick={() => setDrawer(false)}>Reset</Button><Button onClick={() => { setDrawer(false); toast("Filters applied."); }}>Show 6 files</Button></>}>
        <div style={{ display: "grid", gap: 14 }}>
          <Checkbox label="Live" defaultChecked /><Checkbox label="Drafts" defaultChecked /><Checkbox label="Archived" />
          <Select label="Owner" defaultValue="any"><option value="any">Anyone</option><option value="nj">Nusrat Jahan</option><option value="rs">Md Rakib Shekh</option></Select>
        </div>
      </Drawer>
      <Sheet open={sheet} onClose={() => setSheet(false)} title={sel} actions={[
        { label: "Duplicate", icon: <Copy />, onSelect: () => add(`${sel} copy`) },
        { label: "Download", icon: <File />, onSelect: () => toast("Download started.", "default") },
        { label: "Delete", icon: <X />, destructive: true, onSelect: () => setModal(true) },
      ]} />
      <CommandPalette open={cmd} onClose={() => setCmd(false)} showFooter groups={[
        { heading: "Files", items: files.map(f => ({ id: f.n, label: f.n, icon: <File />, onSelect: () => setSel(f.n) })) },
        { heading: "Actions", items: [{ id: "new", label: "New file", icon: <Plus />, shortcut: ["⌘", "N"], onSelect: () => add("Untitled file") }, { id: "people", label: "Invite people", icon: <User /> }] },
      ]} />
    </div>
  );
}

function ReleaseDesk() {
  const toast = useToast();
  const [stage, setStage] = React.useState(0); // 0 idle · 1-3 running · 4 done
  const [pct, setPct] = React.useState(0);
  const [alerts, setAlerts] = React.useState<("success" | "warning")[]>([]);
  const [loading, setLoading] = React.useState(true);
  // The scene plays a deploy on its own when it opens, so the motion is visible without a click.
  React.useEffect(() => { const a = setTimeout(() => setLoading(false), 2200), b = setTimeout(() => { setPct(1); setStage(1); }, 700); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  React.useEffect(() => {
    if (stage < 1 || stage > 3) return;
    const t = setTimeout(() => {
      const n = Math.min(100, pct + 6 + Math.round(Math.random() * 8));
      setPct(n);
      if (n >= stage * 33 && stage < 3) setStage(stage + 1);
      if (n >= 100) { setStage(4); setAlerts(["success", "warning"]); toast("v0.2.0 is live."); }
    }, 180);
    return () => clearTimeout(t);
  }, [stage, pct]);
  const steps = ["Build", "Test", "Ship"];
  return (
    <div className="sc-release">
      <Banner type="brand" action={<Button size="sm" variant="outline" onClick={() => toast("Changelog opened.", "default")}>Read changelog</Button>}>Version 0.2.0 adds 12 components and dark-mode charts.</Banner>
      <div className="sc-release-grid">
        <div className="sc-card">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ProgressCircle value={pct} aria-label="Deploy progress" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 className="sc-h">Deploy v0.2.0</h4>
              <p className="text-body-small text-fg-secondary">{stage === 0 ? "Ready when you are." : stage === 4 ? "Live on uixdesign.pagestro.com" : `${["Building", "Testing", "Shipping"][stage - 1]}… ${pct}%`}</p>
            </div>
            {stage > 0 && stage < 4 ? <Spinner label="Deploying" /> : null}
          </div>
          <Progress value={pct} aria-label="Deploy progress" />
          <Stepper>{steps.map((s, i) => <Step key={s} index={i + 1} title={s} status={stage > i + 1 || stage === 4 ? "complete" : stage === i + 1 ? "current" : "upcoming"} />)}</Stepper>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={() => { setPct(1); setStage(1); setAlerts([]); }} disabled={stage > 0 && stage < 4}>{stage === 4 ? "Deploy again" : "Deploy"}</Button>
            <Button variant="ghost" onClick={() => { setStage(0); setPct(0); setAlerts([]); }}>Reset</Button>
          </div>
          {alerts.includes("success") && <Alert type="success" title="Deployed" onClose={() => setAlerts(a => a.filter(x => x !== "success"))}>All 214 checks passed in 41 s.</Alert>}
          {alerts.includes("warning") && <Alert type="warning" appearance="accent" title="1 slow page" onClose={() => setAlerts(a => a.filter(x => x !== "warning"))}>/pricing takes 2.1 s on 3G. Try lazy images.</Alert>}
        </div>
        <div className="sc-card">
          <h4 className="sc-h">Activity</h4>
          {loading ? [0, 1, 2].map(i => <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}><Skeleton type="avatar" /><div style={{ flex: 1, display: "grid", gap: 8 }}><Skeleton type="text" /><Skeleton type="text" style={{ width: "55%" }} /></div></div>) : <>
            <Notification avatar={<Avatar size="sm" initials="NJ" />} name="Nusrat Jahan" action="approved" target="v0.2.0" time="2 min ago" />
            <Notification avatar={<Avatar size="sm" initials="IJ" />} name="Israt Jahan" action="fixed" target="Chart colours" time="1 h ago" />
            <Notification status="read" avatar={<Avatar size="sm" initials="RS" />} name="Md Rakib Shekh" action="opened" target="Release 0.2" time="Yesterday" />
          </>}
          <EmptyState type="success" icon={<CircleCheck />} title="No open incidents" description="Everything has been running for 18 days." />
        </div>
      </div>
    </div>
  );
}

const TREE: Record<string, string[]> = { "Getting started": ["Install", "Theming", "Dark mode"], Components: ["Button", "Combobox", "Modal"], "AI agents": ["MCP", "llms.txt"] };
function Docs() {
  const [open, setOpen] = React.useState<string[]>(["Components"]);
  const [doc, setDoc] = React.useState("Button");
  const [tab, setTab] = React.useState("preview");
  const [page, setPage] = React.useState(2);
  const [step, setStep] = React.useState(1);
  const group = Object.keys(TREE).find(g => TREE[g].includes(doc)) ?? "Components";
  return (
    <div className="sc-docs">
      <aside className="sc-docs-side">
        <Tree aria-label="Docs">
          {Object.entries(TREE).map(([g, items]) => <React.Fragment key={g}>
            <TreeItem level="1" expanded={open.includes(g)} onClick={() => setOpen(o => o.includes(g) ? o.filter(x => x !== g) : [...o, g])}>{g}</TreeItem>
            {open.includes(g) && items.map(i => <TreeItem key={i} level="2" selected={doc === i} onClick={() => setDoc(i)}>{i}</TreeItem>)}
          </React.Fragment>)}
        </Tree>
      </aside>
      <div className="sc-docs-main">
        <Breadcrumb items={[{ label: "Docs", href: "#components" }, { label: group, href: "#components" }, { label: doc }]} />
        <h4 className="font-heading text-heading-4">{doc}</h4>
        <Tabs value={tab} onValueChange={setTab} appearance="underline">
          <TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger><TabsTrigger value="props" count={4}>Props</TabsTrigger></TabsList>
          <TabsContent value="preview">
            <div className="sc-docs-preview"><Button>Save</Button><Button variant="soft">Soft</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button loading>Saving</Button></div>
          </TabsContent>
          <TabsContent value="code"><CodeBlock filename={`${doc.toLowerCase()}.tsx`} showLineNumbers code={`import { ${doc} } from "@/components/ui/${doc.toLowerCase()}";\n\nexport function Example() {\n  return <${doc} variant="primary">Save</${doc}>;\n}`} /></TabsContent>
          <TabsContent value="props">
            <Table>
              <TableHeader><TableRow><TableHead>Prop</TableHead><TableHead>Values</TableHead><TableHead>Default</TableHead></TableRow></TableHeader>
              <TableBody>{[["variant", "primary · soft · outline · ghost…", "primary"], ["size", "sm · md · lg", "md"], ["loading", "boolean", "false"], ["leadingIcon", "ReactNode", "–"]].map(r => <TableRow key={r[0]}>{r.map((c, i) => <TableCell key={i}>{i ? c : <code className="mono">{c}</code>}</TableCell>)}</TableRow>)}</TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        <div className="sc-docs-foot"><Pagination page={page} pageCount={9} onPageChange={setPage} /></div>
      </div>
      <div className="sc-card sc-docs-steps">
        <h4 className="sc-h">Get set up</h4>
        <Stepper>{["Install", "Pick a theme", "Add components"].map((s, i) => <Step key={s} index={i + 1} title={s} description={i === 0 ? "npx uix-ui init" : i === 1 ? "41 free themes" : "Only what you need"} status={i < step ? "complete" : i === step ? "current" : "upcoming"} />)}</Stepper>
        <div style={{ display: "flex", gap: 8 }}><Button size="sm" variant="ghost" disabled={!step} onClick={() => setStep(s => s - 1)}>Back</Button><Button size="sm" disabled={step > 2} onClick={() => setStep(s => s + 1)}>{step >= 2 ? "Finish" : "Next"}</Button></div>
      </div>
    </div>
  );
}

const SERIES = { day: [12, 18, 15, 22, 30, 26, 34], week: [42, 58, 51, 74, 66, 88, 71], month: [210, 260, 240, 310, 330, 380, 420] };
const PEOPLE = [{ name: "Nusrat Jahan", city: "Dhaka", spend: 24000, s: "Active" }, { name: "Israt Jahan", city: "Sylhet", spend: 18500, s: "Active" }, { name: "Md Rakib Shekh", city: "Dhaka", spend: 41200, s: "VIP" }, { name: "Tanvir Ahmed", city: "Khulna", spend: 9800, s: "New" }];
function Analytics() {
  const [range, setRange] = React.useState<keyof typeof SERIES>("week");
  const [type, setType] = React.useState<"bar" | "line" | "donut">("line");
  const [sort, setSort] = React.useState<1 | -1>(-1);
  const [alerts, setAlerts] = React.useState(true);
  const data = SERIES[range].map((v, i) => ({ label: range === "month" ? ["W1", "W2", "W3", "W4", "W5", "W6", "W7"][i] : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"][i], value: v }));
  const sum = data.reduce((a, b) => a + b.value, 0);
  return (
    <div className="sc-analytics">
      <div className="sc-an-top">
        <Segmented value={range} onValueChange={v => setRange(v as typeof range)} options={[{ value: "day", label: "Today" }, { value: "week", label: "This week" }, { value: "month", label: "This month" }]} />
        <span className="text-body-small text-fg-secondary" style={{ marginLeft: "auto" }}>Press <Kbd size="sm">R</Kbd> to refresh</span>
      </div>
      <div className="sc-an-stats">
        <Stat appearance="elevated" label="Orders" value={sum.toLocaleString("en-IN")} delta="+12.4%" caption="vs last period" />
        <Stat appearance="elevated" label="Revenue" value={`৳${(sum * 380).toLocaleString("en-IN")}`} delta="+8.1%" caption="vs last period" />
        <Stat appearance="elevated" label="Refunds" value="0.9%" delta="−0.3%" trend="down" caption="vs last period" />
      </div>
      <div className="sc-an-main">
        <div className="sc-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <h4 className="sc-h">Orders</h4>
            <Segmented size="sm" value={type} onValueChange={v => setType(v as typeof type)} options={[{ value: "line", label: "Line" }, { value: "bar", label: "Bar" }, { value: "donut", label: "Donut" }]} />
          </div>
          <Chart type={type} data={data} value={sum.toLocaleString("en-IN")} delta="+18%" highlight={5} />
        </div>
        <div className="sc-card">
          <h4 className="sc-h">Today</h4>
          <Timeline>
            <TimelineItem status="done" title="Order #2841 paid" time="9:40" />
            <TimelineItem status="done" title="Restocked Darjeeling" time="10:05" />
            <TimelineItem status="current" title="Packing 12 orders" time="11:15" />
            <TimelineItem status="upcoming" title="Courier pickup" time="15:00" last />
          </Timeline>
          <ListItem type="toggle" title="Low-stock alerts" subtitle="Email when under 10" checked={alerts} onCheckedChange={setAlerts} />
        </div>
      </div>
      <div className="sc-card">
        <Table>
          <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>City</TableHead><TableHead>Status</TableHead>
            <TableHead aria-sort={sort === 1 ? "ascending" : "descending"}><button type="button" style={{ all: "unset", cursor: "pointer" }} onClick={() => setSort(s => (s === 1 ? -1 : 1))}>Spend {sort === 1 ? "↑" : "↓"}</button></TableHead></TableRow></TableHeader>
          <TableBody>{[...PEOPLE].sort((a, b) => (a.spend - b.spend) * sort).map(r => (
            <TableRow key={r.name}>
              <TableCell><span style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar size="sm" initials={r.name.split(" ").slice(-2).map(x => x[0]).join("")} />{r.name}</span></TableCell>
              <TableCell>{r.city}</TableCell>
              <TableCell><Badge size="sm" color={r.s === "VIP" ? "brand" : r.s === "New" ? "warning" : "success"} dot>{r.s}</Badge></TableCell>
              <TableCell>৳{r.spend.toLocaleString("en-IN")}</TableCell>
            </TableRow>))}
          </TableBody>
        </Table>
      </div>
      <div className="sc-card">
        <Accordion>
          <AccordionItem title="How is revenue counted?" open>Paid orders minus refunds, in taka, by the day the payment cleared.</AccordionItem>
          <AccordionItem title="Can I export this?">Yes, as CSV from the menu, or connect your AI agent to read it.</AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function Editor() {
  const toast = useToast();
  const [b, setB] = React.useState(false), [i, setI] = React.useState(false), [u, setU] = React.useState(false);
  const [tags, setTags] = React.useState(["Design", "Launch"]);
  const [stars, setStars] = React.useState(4);
  const [busy, setBusy] = React.useState(false);
  const all = ["Design", "Engineering", "Launch", "Marketing", "Support"];
  return (
    <div className="sc-editor">
      <div className="sc-editor-bar">
        <ToggleGroup attached aria-label="Text style">
          <Toggle aria-label="Bold" onPressedChange={setB}><b>B</b></Toggle>
          <Toggle aria-label="Italic" onPressedChange={setI}><i>I</i></Toggle>
          <Toggle aria-label="Underline" onPressedChange={setU}><u>U</u></Toggle>
        </ToggleGroup>
        <Tooltip content="Insert image"><IconButton variant="ghost" aria-label="Insert image"><Upload /></IconButton></Tooltip>
        <Tooltip content="Add a callout"><IconButton variant="ghost" aria-label="Add a callout"><Megaphone /></IconButton></Tooltip>
        <Tooltip content="Copy link"><IconButton variant="ghost" aria-label="Copy link" onClick={() => toast("Link copied.", "default")}><Copy /></IconButton></Tooltip>
        <span style={{ flex: 1 }} />
        <Button variant="link" onClick={() => toast("Version history opened.", "default")}>History</Button>
        <Button variant="ghost">Discard</Button>
        <Button variant="outline">Preview</Button>
        <Button variant="soft" onClick={() => toast("Draft saved.", "default")}>Save draft</Button>
        <Button loading={busy} onClick={() => { setBusy(true); setTimeout(() => { setBusy(false); toast("Published to the blog."); }, 1400); }} leadingIcon={<Zap />}>{busy ? "Publishing" : "Publish"}</Button>
      </div>
      <div className="sc-editor-doc">
        <div className="sc-editor-tags">{all.map(t => <Chip key={t} selected={tags.includes(t)} onClick={() => setTags(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])}>{t}</Chip>)}</div>
        <h4 className="font-heading text-heading-3" contentEditable suppressContentEditableWarning>Why we built uix-ui</h4>
        <p className="text-body-large text-fg-secondary" contentEditable suppressContentEditableWarning style={{ fontWeight: b ? 700 : undefined, fontStyle: i ? "italic" : undefined, textDecoration: u ? "underline" : undefined }}>
          Design systems shouldn't stop at Figma. Pick some text and try the toolbar: every control here is a uix-ui component, and so is the rating below.
        </p>
        <div className="sc-editor-rate">
          <span className="text-label-medium">How does this draft read?</span>
          <Rating value={stars} onValueChange={setStars} aria-label="Rate the draft" />
          <span className="text-body-small text-fg-secondary">{["", "Needs work", "Getting there", "Good", "Great", "Ship it"][stars]}</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="destructive" size="sm" onClick={() => toast("Post deleted.", "error")}>Delete post</Button>
          <Button size="sm" variant="outline" leadingIcon={<Inbox />}>Send to review</Button>
        </div>
      </div>
    </div>
  );
}

export const SCENES = [
  { id: "forms", name: "Checkout", group: "Forms", url: "shapla.app/checkout", note: "Validation, combobox, OTP, date range, plans", C: Checkout, slugs: ["input", "combobox", "select", "tag-input", "number-input", "date-picker", "popover", "otp-input", "segmented", "selection-card", "slider", "switch", "checkbox", "textarea", "file-upload", "button"] },
  { id: "overlays", name: "Workspace", group: "Overlays", url: "shapla.app/files", note: "Menu, popover, drawer, sheet, modal, ⌘K", C: Workspace, slugs: ["menu", "command-palette", "popover", "drawer", "sheet", "modal", "tooltip", "card", "badge", "avatar-group", "icon-button"] },
  { id: "feedback", name: "Release desk", group: "Feedback", url: "shapla.app/releases", note: "Progress, alerts, skeletons, toasts", C: ReleaseDesk, slugs: ["banner", "progress-circle", "progress", "spinner", "stepper", "alert", "skeleton", "notification", "empty-state"] },
  { id: "navigation", name: "Docs", group: "Navigation", url: "shapla.app/docs", note: "Tree, breadcrumb, tabs, pagination", C: Docs, slugs: ["tree-view", "breadcrumb", "tabs", "code-block", "table", "pagination", "stepper"] },
  { id: "data", name: "Analytics", group: "Data display", url: "shapla.app/insights", note: "Stats, charts, sortable table, timeline", C: Analytics, slugs: ["segmented", "stat", "chart", "timeline", "list-item", "table", "avatar", "badge", "accordion", "kbd"] },
  { id: "actions", name: "Editor", group: "Actions", url: "shapla.app/write", note: "Toggles, chips, rating, every button", C: Editor, slugs: ["toggle", "icon-button", "tooltip", "button", "chip", "rating"] },
];

const GLYPH: Record<string, React.ReactNode> = {
  forms: <><rect x="4" y="5" width="16" height="3" rx="1.5" /><rect x="4" y="11" width="16" height="3" rx="1.5" /><rect x="4" y="17" width="9" height="3" rx="1.5" /></>,
  overlays: <><rect x="3" y="7" width="13" height="12" rx="2" /><rect x="8" y="3" width="13" height="12" rx="2" /></>,
  feedback: <><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 8 8" /></>,
  navigation: <><path d="M4 5h4M4 12h4M4 19h4" /><rect x="11" y="4" width="9" height="16" rx="2" /></>,
  data: <><path d="M5 19V11M10 19V6M15 19v-5M20 19V8" /></>,
  actions: <><rect x="3" y="8" width="18" height="8" rx="4" /><circle cx="15" cy="12" r="2" /></>,
};

export function Studio() {
  const { id, mode, setMode } = usePreset();
  const [scene, setScene] = React.useState("forms");
  const [xray, setXray] = React.useState(false);
  const [focus, setFocus] = React.useState<string | null>(null);
  const stage = React.useRef<HTMLDivElement>(null);
  const s = SCENES.find(x => x.id === scene) ?? SCENES[0];
  React.useEffect(() => {
    const go = (e: Event) => setScene((e as CustomEvent).detail);
    window.addEventListener("uix-scene", go);
    return () => window.removeEventListener("uix-scene", go);
  }, []);
  return (
    <section className="studio row" id="components" data-preset={id}>
      <div className="wrap studio-in">
        <div className="studio-mesh" aria-hidden />
        <div className="studio-head">
          <div className="head" style={{ marginBottom: 0 }}>
            <span className="eyebrow studio-eyebrow">Component studio</span>
            <h2 className="h2 studio-h2">Six real screens.<br />Take any part of them.</h2>
            <p className="lead studio-lead">Click, type, open and drag. Turn on X-ray to see each component's name, the same name it has in Figma, then copy its install command.</p>
          </div>
          <div className="studio-controls">
            <ThemePicker />
            <div className="studio-row">
              <div className="mode" role="group" aria-label="Light or dark">
                <button type="button" aria-pressed={mode === "light"} onClick={() => setMode("light")}><ISun /> Light</button>
                <button type="button" aria-pressed={mode === "dark"} onClick={() => setMode("dark")}><IMoon /> Dark</button>
              </div>
              <button type="button" className="xray" aria-pressed={xray} onClick={() => setXray(x => !x)}><span className="xray-dot" aria-hidden />X-ray</button>
            </div>
          </div>
        </div>

        <div className="scenes" role="tablist" aria-label="Scenes">
          {SCENES.map((x, i) => (
            <button key={x.id} type="button" role="tab" aria-selected={x.id === scene} aria-controls="scene-stage" className="scene-tab" onClick={() => { setScene(x.id); setFocus(null); }}>
              <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">{GLYPH[x.id]}</svg>
              <b>{x.name}</b>
              <small>0{i + 1} · {x.group}</small>
            </button>
          ))}
        </div>

        <div className="stage-frame" data-scene={s.id}>
          <div className="stage-bar">
            <span className="dots" aria-hidden><i /><i /><i /></span>
            <span className="url">{s.url}</span>
            <span className="stage-note">{s.note}</span>
          </div>
          <div className="stage-body" id="scene-stage" role="tabpanel" aria-label={`${s.name} scene`} ref={stage}>
            <div className="scene-anim" key={s.id}><s.C /></div>
            <Inspector root={stage} xray={xray} focus={focus} />
          </div>
        </div>

        <div className="in-scene" aria-label="Components in this scene">
          <span>In this scene</span>
          {s.slugs.map(slug => <button key={slug} type="button" className="in-chip" aria-pressed={focus === slug} onPointerEnter={() => setFocus(slug)} onPointerLeave={() => setFocus(null)} onFocus={() => setFocus(slug)} onBlur={() => setFocus(null)} onClick={() => setFocus(f => (f === slug ? null : slug))}>{label(slug)}</button>)}
        </div>
      </div>
    </section>
  );
}
