import * as React from "react";
import data from "./code.json";
import { actions } from "./actions";
import { forms } from "./forms";
import { navigation } from "./navigation";
import { feedback } from "./feedback";
import { dataDisplay } from "./data";
import { overlays } from "./overlays";

/* Every demo is a plain function in one of these files. `code` is generated from that function's own source by
   scripts/component-docs.mjs (src/examples/code.json), so the snippet on a page is the demo you see. */
export type Example = { title: string; code: string; render: () => React.ReactNode };
type Def = { title: string; Demo: React.ComponentType };

const defs: Record<string, Def[]> = { ...actions, ...forms, ...navigation, ...feedback, ...dataDisplay, ...overlays };

export const EXAMPLES: Record<string, Example[]> = Object.fromEntries(
  Object.entries(defs).map(([slug, list]) => [
    slug,
    list.map((d, i): Example => ({ title: d.title, code: (data.code as Record<string, string>)[`${slug}/${i}`] ?? "", render: () => React.createElement(d.Demo) })),
  ]),
);

/** The JSX a demo returns, used for the short "Usage" snippet. */
export const usageOf = (slug: string, i = 0) => (data.jsx as Record<string, string>)[`${slug}/${i}`] ?? "";

/** Width (px) a component is laid out at inside its small tile on /components; the tile then scales it down to fit. */
export const TILE_WIDTH: Record<string, number> = {
  navbar: 800, footer: 800, table: 560, "description-list": 520, "cookie-banner": 760, banner: 640, "bottom-nav": 420, "code-block": 520,
  chart: 440, stepper: 560, timeline: 360, "date-picker": 340, "tag-input": 380, alert: 480, "empty-state": 440, notification: 480, "list-item": 400,
  "avatar-group": 300, "otp-input": 380, pagination: 440, breadcrumb: 380, "button-group": 300, segmented: 340, tabs: 420, "selection-card": 400,
};
