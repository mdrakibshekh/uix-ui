import * as React from "react";
import registry from "../../registry/registry.json";
import presets from "./presets.json";
import { matchPath, type Params } from "./router";

/** A page that lives in its own chunk. `preload()` fetches it; the client calls it before hydrating and before each
    navigation, and the pre-renderer loads every page first, so a page never renders empty. `chunk` names the source
    file, so prerender.mjs can add <link rel="modulepreload"> for it. */
export type PageComponent = React.ComponentType & { preload: () => Promise<unknown>; chunk: string };
function lazyPage(chunk: string, load: () => Promise<{ default: React.ComponentType }>): PageComponent {
  let C: React.ComponentType | null = null, loading: Promise<unknown> | null = null;
  const preload = () => (loading ??= load().then(m => { C = m.default; }));
  function Page() {
    const [, loaded] = React.useState(false);
    React.useEffect(() => { if (!C) preload().then(() => loaded(true)); }, []);
    return C ? <C /> : null;
  }
  return Object.assign(Page, { preload, chunk });
}
const Home = lazyPage("src/pages/Home.tsx", () => import("./pages/Home"));
const Docs = lazyPage("src/pages/Docs.tsx", () => import("./pages/Docs"));
const Components = lazyPage("src/pages/Components.tsx", () => import("./pages/Components"));
const ComponentPage = lazyPage("src/pages/ComponentPage.tsx", () => import("./pages/ComponentPage"));
const Themes = lazyPage("src/pages/Themes.tsx", () => import("./pages/Themes"));
const ThemePage = lazyPage("src/pages/ThemePage.tsx", () => import("./pages/ThemePage"));
const Examples = lazyPage("src/pages/Examples.tsx", () => import("./pages/Examples"));
const Templates = lazyPage("src/pages/Templates.tsx", () => import("./pages/Templates"));
const NotFound = lazyPage("src/pages/NotFound.tsx", () => import("./pages/NotFound"));

type Text = string | ((p: Params) => string);
export type PageRoute = { path: string; title: Text; description: Text; component: PageComponent };

export const DOC_PAGES = ["installation", "theming", "dark-mode", "cli", "mcp", "figma"];
const ITEMS = registry.items.filter(i => i.type === "registry:ui" && i.name !== "icons");
const item = (slug: string) => ITEMS.find(i => i.name === slug);
const words = (s: string) => s.replace(/-/g, " ").replace(/^./, c => c.toUpperCase());
const SITE = "uix-ui";
const DOC_TITLES: Record<string, string> = { cli: "CLI", mcp: "MCP and AI agents" };
const docTitle = (page: string) => DOC_TITLES[page] ?? words(page);
const DOC_DESC: Record<string, string> = {
  installation: "Add uix-ui to a Next.js, Vite, Astro or existing React app: run init, pick a theme, add components.",
  theming: "How a uix-ui theme works: colour ramps, semantic tokens, fonts, radius and shadows, and how to change them.",
  "dark-mode": "Every uix-ui theme has light and dark colours. Switch with one data-theme attribute; no component changes.",
  cli: "The uix-ui CLI: init, add, theme and list. What each command does, what it writes and what it prints.",
  mcp: "Connect Claude Code, Cursor or VS Code to the UIX MCP server so your AI agent can find themes and read their tokens.",
  figma: "uix-ui and UIX for Figma make the same design system. Export its tokens from Figma to your code.",
};

export const routes: PageRoute[] = [
  { path: "/", title: "uix-ui: open-source React components and Tailwind themes in your brand", description: "64 open-source React components and 42 Tailwind CSS v4 themes, made by the same engine as the UIX Figma plugin. Live, animated, accessible. MIT licensed.", component: Home },
  { path: "/docs", title: `Docs | ${SITE}`, description: "How to install uix-ui, theme it, and use it with your AI agent.", component: Docs },
  { path: "/docs/:page", title: p => `${docTitle(p.page)} | Docs | ${SITE}`, description: p => DOC_DESC[p.page] ?? `uix-ui docs: ${docTitle(p.page)}.`, component: Docs },
  { path: "/components", title: `Components | ${SITE}`, description: `All ${ITEMS.length} uix-ui components, with live previews and code.`, component: Components },
  { path: "/components/:slug", title: p => `${words(p.slug)} | Components | ${SITE}`, description: p => item(p.slug)?.description ?? `The ${words(p.slug)} component from uix-ui.`, component: ComponentPage },
  { path: "/themes", title: `Themes | ${SITE}`, description: `${presets.free.length} free Tailwind v4 themes for uix-ui, each with light and dark colours.`, component: Themes },
  { path: "/themes/:id", title: p => `${presets.free.find(t => t.id === p.id)?.name ?? words(p.id)} theme | ${SITE}`, description: p => presets.free.find(t => t.id === p.id)?.summary ?? (p.id === "uix" ? "The UIX house theme: indigo actions on zinc neutrals, set in Montserrat, with light and dark colours." : "A uix-ui theme."), component: ThemePage },
  { path: "/examples", title: `Examples | ${SITE}`, description: "Full screens built with uix-ui components.", component: Examples },
  { path: "/templates", title: `Templates | ${SITE}`, description: "Page templates and blocks from UIX Pro.", component: Templates },
  { path: "*", title: `Page not found | ${SITE}`, description: "That page does not exist.", component: NotFound },
];

export function matchRoute(path: string) {
  for (const r of routes) { const params = matchPath(r.path, path); if (params) return { route: r, params }; }
  throw new Error("unreachable: '*' matches everything");
}
export const titleOf = (path: string) => { const { route, params } = matchRoute(path); const f = (t: Text) => (typeof t === "function" ? t(params) : t); return { title: f(route.title), description: f(route.description) }; };

/** Load the page chunk for a path (before hydrating or navigating). */
export const preloadPath = (path: string) => matchRoute(path).route.component.preload();
export const preloadAll = () => Promise.all(routes.map(r => r.component.preload()));
export const chunkOf = (path: string) => matchRoute(path).route.component.chunk;

/** Every path to pre-render (the not-found page is written separately as 404.html). */
export function allPaths(): string[] {
  return [
    "/", "/docs", "/components", "/themes", "/examples", "/templates",
    ...DOC_PAGES.map(p => `/docs/${p}`),
    ...ITEMS.map(i => `/components/${i.name}`),
    ...[...presets.free.map(t => t.id), "uix"].map(id => `/themes/${id}`),
  ];
}
