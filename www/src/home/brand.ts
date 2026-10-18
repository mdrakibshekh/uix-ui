import data from "../presets.json";

/** A theme as the site needs it: id, name, light/dark brand colour, fonts, radius and who it is for. */
export type Look = { id: string; name: string; light: string; dark: string; display: string; sans: string; radius: number; industry: string; mood: string; summary: string };

/** The site's own UIX look (the logo colours, see styles/uix-site.css), then the 41 free presets. */
export const UIX: Look = { id: "uix", name: "UIX", light: "#6301E4", dark: "#6301E4", display: "Montserrat", sans: "Montserrat", radius: 8, industry: "design systems", mood: "house style", summary: "The UIX house style, from the logo." };
export const LOOKS: Look[] = [UIX, ...data.free.map(p => ({
  id: p.id, name: p.name, light: p.light.primary, dark: p.dark.primary, display: p.fonts.display, sans: p.fonts.sans, radius: p.radius,
  industry: (p.industries[0] ?? "").replace(/-/g, " "), mood: p.moods[0] ?? "", summary: p.summary,
}))];
export const lookById = (id: string) => LOOKS.find(l => l.id === id) ?? UIX;
export const fontsOf = (l: Look) => (l.display === l.sans ? l.display : `${l.display} + ${l.sans}`);

/* ---------- colour maths: every text pair the chrome draws is pushed to WCAG AA ---------- */
const rgb = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const hex = (a: number[]) => "#" + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, t: number) => { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => v + (y[i] - v) * t)); };
const lum = (h: string) => { const [r, g, b] = rgb(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contrast = (a: string, b: string) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
/** Moves `c` toward `to` until it reaches `min` contrast against every background. */
export const toward = (c: string, to: string, bgs: string[], min = 4.5) => { let t = 0, o = c; while (t < 1 && bgs.some(b => contrast(o, b) < min)) { t += 0.04; o = mix(c, to, t); } return o; };
export const ramp = (base: string) => [0.95, 0.88, 0.74, 0.55, 0.3, 0, -0.18, -0.36, -0.52, -0.66, -0.8].map(t => (t >= 0 ? mix(base, "#FFFFFF", t) : mix(base, "#000000", -t)));

/** The chrome's brand variables for a look in light or dark. */
export function chromeVars(l: Look, dark: boolean) {
  const bg = dark ? "#09090B" : "#FFFFFF";
  let brand = dark ? l.dark : l.light, on = "#FFFFFF";
  if (contrast(on, brand) < 4.5) { if (contrast("#09090B", brand) >= 4.5) on = "#09090B"; else brand = toward(brand, "#000000", ["#FFFFFF"]); }
  const soft = mix(brand, bg, dark ? 0.82 : 0.92);
  const ink = toward(brand, dark ? "#FFFFFF" : "#000000", [soft, bg]);
  return { brand, on, soft, ink, ratio: contrast(on, brand) };
}

/* ---------- theme fonts: loaded once each, only on the client ---------- */
const loaded = new Set(["Montserrat"]);
export function loadFont(f: string) {
  if (typeof document === "undefined" || loaded.has(f)) return;
  loaded.add(f);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}
