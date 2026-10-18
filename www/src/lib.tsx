import * as React from "react";
import data from "./presets.json";

export type Preset = (typeof data.free)[number];
/** The UIX house theme in the logo colours (styles/uix-site.css re-skins public/themes/uix.css to match). */
export const UIX_PRESET: Preset = {
  id: "uix", name: "UIX", summary: "The UIX house style: logo indigo, gold accents, zinc neutrals, Montserrat.",
  fonts: { display: "Montserrat", sans: "Montserrat", mono: "JetBrains Mono" }, radius: 8,
  light: { background: "#FFFFFF", foreground: "#09090B", primary: "#6301E4", accent: "#FBAE17", muted: "#F4F4F5" },
  dark: { background: "#09090B", foreground: "#FAFAFA", primary: "#6301E4", accent: "#FBAE17", muted: "#27272A" },
  moods: ["house style"], industries: ["design-systems"],
} as Preset;
export const FREE: Preset[] = data.free;
/** Every theme the site can wear: UIX first, then the free presets. */
export const ALL: Preset[] = [UIX_PRESET, ...data.free];
export const PRO = data.pro;
export const COUNTS = data.counts;
export const DEFAULT_ID = "uix";
export const byId = (id: string) => ALL.find(p => p.id === id) ?? UIX_PRESET;

/* ---------- loading a preset's scoped CSS and fonts, once each ---------- */
const loaded = new Set<string>();
const addLink = (href: string) => {
  if (loaded.has(href)) return Promise.resolve();
  loaded.add(href);
  return new Promise<void>(res => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.onload = l.onerror = () => res();
    document.head.appendChild(l);
  });
};
const fontHref = (f: string) => `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700&display=swap`;
export function loadPreset(id: string) {
  const p = byId(id);
  return Promise.all([addLink(`${import.meta.env.BASE_URL}themes/${id}.css`), ...[...new Set(Object.values(p.fonts))].map(f => addLink(fontHref(f)))]);
}

/* ---------- the page-wide preset (hero app, playground) ---------- */
type Ctx = { id: string; set: (id: string, from?: "tour") => void; mode: "light" | "dark"; setMode: (m: "light" | "dark") => void; tour: boolean; setTour: (on: boolean) => void };
const PresetCtx = React.createContext<Ctx>(null!);
export const usePreset = () => React.useContext(PresetCtx);

const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

export function PresetProvider({ children }: { children: React.ReactNode }) {
  // The server and the first client render use these defaults; the real values are read in the effect below.
  const [id, setId] = React.useState(DEFAULT_ID);
  const [mode, setModeState] = React.useState<"light" | "dark">("light");
  // The hero theme tour is off by default; it only runs if something calls setTour(true). It stops when someone picks a theme anywhere on the page.
  const [tour, setTour] = React.useState(false);
  React.useEffect(() => {
    const s = store.get("uixui.preset");
    if (s && ALL.some(p => p.id === s)) setId(s);
    setModeState(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);
  React.useEffect(() => { loadPreset(id); }, [id]);
  const set = React.useCallback((next: string, from?: "tour") => {
    if (from !== "tour") setTour(false);
    loadPreset(next).then(() => {
      const go = () => setId(next);
      const vt = (document as any).startViewTransition;
      if (vt && !matchMedia("(prefers-reduced-motion: reduce)").matches) vt.call(document, () => { go(); }); else go();
    });
    if (from !== "tour") store.set("uixui.preset", next);
  }, []);
  const setMode = React.useCallback((m: "light" | "dark") => {
    const apply = () => { document.documentElement.setAttribute("data-theme", m); setModeState(m); };
    const vt = (document as any).startViewTransition;
    if (vt && !matchMedia("(prefers-reduced-motion: reduce)").matches) vt.call(document, apply); else apply();
    store.set("uixui.mode", m);
  }, []);
  return <PresetCtx.Provider value={{ id, set, mode, setMode, tour, setTour }}>{children}</PresetCtx.Provider>;
}

/* ---------- small shared bits ---------- */
export function useCopy() {
  const [done, setDone] = React.useState<string | null>(null);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setDone(text); } catch { setDone(null); }
    window.setTimeout(() => setDone(null), 1600);
  };
  return { copy, done };
}

export function CopyCmd({ cmd, className = "", label }: { cmd: string; className?: string; label?: string }) {
  const { copy, done } = useCopy();
  return (
    <button type="button" className={`cmd ${className}`} onClick={() => copy(cmd)} aria-label={`Copy: ${cmd}`}>
      <span className="cmd-dollar" aria-hidden>$</span>
      <code>{label ?? cmd}</code>
      <span className="cmd-copy" aria-live="polite">{done === cmd ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** Runs `fn` once when the element first scrolls into view. */
export function useInView<T extends Element>(fn?: () => void, margin = "0px 0px -10% 0px") {
  const ref = React.useRef<T>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); fn?.(); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** Pointer-following glow for cards (sets --mx / --my). */
export const spotlight = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

/** WCAG contrast of two CSS colors as the browser resolves them (any format). */
export function contrast(a: string, b: string) {
  const c = document.createElement("canvas").getContext("2d")!;
  const rgb = (col: string) => { c.fillStyle = "#000"; c.fillStyle = col; c.fillRect(0, 0, 1, 1); const d = c.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]]; };
  const lum = (col: string) => { const [r, g, bl] = rgb(col).map(v => v / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * bl; };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
