import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import "./styles/uix-site.css";
import "./styles/skins.css";
import "./styles/backdrops.css";
import "./home/home.css";
import "./home/scenes.css";
import "./select.css";
// Page CSS stays in the one stylesheet, so pre-rendered pages are styled before their page chunk arrives.
import "./site/docs.css";
import "./pages/docs-pages.css";
import "./pages/components.css";
import "./pages/themes.css";
import App from "./App";
import { preloadPath } from "./routes";
import { pathOf } from "./router";

const root = document.getElementById("root")!;
const url = location.pathname + location.search;
const app = <StrictMode><App url={url} /></StrictMode>;
// Pre-rendered pages have markup in #root: load this page's chunk, then hydrate. In dev it is empty: render from scratch.
preloadPath(pathOf(url)).finally(() => { if (root.hasChildNodes()) hydrateRoot(root, app); else createRoot(root).render(app); });
