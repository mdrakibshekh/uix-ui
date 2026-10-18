import * as React from "react";
import { usePreset } from "../lib";
import { chromeVars, fontsOf, loadFont, lookById } from "./brand";

/** Visual style (the library's skins: Modern is free, the rest are UIX Pro) and corner shape for every demo on the site. */
export const SKINS = [
  { id: "modern", name: "Modern", pro: false }, { id: "glass", name: "Glass", pro: true }, { id: "brutalism", name: "Brutal", pro: true },
  { id: "clay", name: "Clay", pro: true }, { id: "neon", name: "Neon", pro: true },
  // ponytail: Neumorphism is left out until its dark surfaces keep brand and tertiary text at AA (fails at 4.35:1 today).
] as const;
export type SkinId = (typeof SKINS)[number]["id"];
export type Shape = "sharp" | "rounded" | "pill";

type Ctx = { skin: SkinId; setSkin: (s: SkinId) => void; shape: Shape; setShape: (s: Shape) => void };
const LookCtx = React.createContext<Ctx>({ skin: "modern", setSkin: () => {}, shape: "rounded", setShape: () => {} });
export const useLook = () => React.useContext(LookCtx);

export function LookProvider({ children }: { children: React.ReactNode }) {
  const [skin, setSkin] = React.useState<SkinId>("modern");
  const [shape, setShape] = React.useState<Shape>("rounded");
  return <LookCtx.Provider value={{ skin, setSkin, shape, setShape }}>{children}</LookCtx.Provider>;
}

/** Props for any wrapper that shows live components: the theme, the skin and the shape. */
export function useDemo(id?: string) {
  const { id: page } = usePreset();
  const { skin, shape } = useLook();
  return { "data-preset": id ?? page, "data-skin": skin === "modern" ? undefined : skin, "data-shape": shape } as const;
}

/** Keeps the page chrome (buttons, links, focus) in the picked theme's brand colour, computed to AA, and loads its fonts. */
export function ChromeSync() {
  const { id, mode } = usePreset();
  React.useEffect(() => {
    const l = lookById(id), v = chromeVars(l, mode === "dark"), s = document.documentElement.style;
    s.setProperty("--brand", v.brand); s.setProperty("--on-brand", v.on); s.setProperty("--soft", v.soft); s.setProperty("--bink", v.ink);
    s.setProperty("--dh", `'${l.display}', var(--font)`); s.setProperty("--db", `'${l.sans}', var(--font)`);
    loadFont(l.display); loadFont(l.sans);
    document.documentElement.dataset.look = l.id;
    document.documentElement.style.setProperty("--look-fonts", JSON.stringify(fontsOf(l)));
  }, [id, mode]);
  return null;
}
