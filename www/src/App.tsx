import * as React from "react";
import { ALL, PresetProvider, usePreset } from "./lib";
import { ToastProvider, useToast } from "./toast";
import { Link, RouterProvider, navigate, useRoute } from "./router";
import { allPaths, matchRoute, preloadPath, routes, titleOf } from "./routes";
import { CommandPalette } from "./components/ui/command-palette";
import { ArrowRight, Folder, Star } from "./components/ui/icons";
import { ChromeSync, LookProvider } from "./home/look";

// The main sections of the library site. "UIX for Figma" is the separate sister product.
const LINKS = [["Docs", "/docs"], ["Components", "/components"], ["Examples", "/examples"], ["Themes", "/themes"], ["Templates", "/templates"]] as const;
const GITHUB = "https://github.com/mdrakibshekh/uix-ui";
const titleCase = (s: string) => s.replace(/-/g, " ").replace(/^./, c => c.toUpperCase());

const IconSearch = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
const IconGithub = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" /></svg>;
const IconMoon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>;
const IconSun = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;

function Nav({ onSearch }: { onSearch: () => void }) {
  const { mode, setMode } = usePreset();
  const { path } = useRoute();
  const on = (h: string) => path === h || path.startsWith(h + "/");
  return (
    <header className="site-top">
      <div className="wrap nav">
        <Link className="logo" to="/" aria-label="uix-ui home"><span className="mark">ui</span>uix-ui</Link>
        <nav className="links" aria-label="Main">
          {LINKS.map(([l, h]) => <Link key={h} to={h} className={on(h) ? "on" : undefined} aria-current={on(h) ? "page" : undefined}>{l}</Link>)}
          <a href="https://uixdesign.pagestro.com/">UIX for Figma</a>
        </nav>
        <div className="right">
          <button type="button" className="search" onClick={onSearch}><IconSearch />Search documentation…<kbd>⌘K</kbd></button>
          <button type="button" className="ic search-m" onClick={onSearch} aria-label="Search"><IconSearch /></button>
          <a className="ic" href={GITHUB} aria-label="uix-ui on GitHub"><IconGithub /></a>
          <button type="button" className="ic" onClick={() => setMode(mode === "dark" ? "light" : "dark")} aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>{mode === "dark" ? <IconSun /> : <IconMoon />}</button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer><div className="wrap">
      <div className="fgrid">
        <div><Link className="logo" to="/"><span className="mark">ui</span>uix-ui</Link><p>Open-source React components and Tailwind CSS v4 themes, by Pagestro. Its sister product, UIX for Figma, builds the same design system in Figma.</p></div>
        <div><h5>Docs</h5><ul><li><Link to="/docs">Introduction</Link></li><li><Link to="/docs/installation">Installation</Link></li><li><Link to="/docs/theming">Theming</Link></li><li><Link to="/docs/dark-mode">Dark mode</Link></li><li><Link to="/docs/cli">CLI</Link></li></ul></div>
        <div><h5>Library</h5><ul><li><Link to="/components">Components</Link></li><li><Link to="/examples">Examples</Link></li><li><Link to="/themes">Themes</Link></li><li><Link to="/templates">Templates</Link></li><li><Link to="/docs/mcp">AI agents and MCP</Link></li></ul></div>
        <div><h5>Community</h5><ul><li><a href={GITHUB}>GitHub</a></li><li><a href="https://uixdesign.pagestro.com/llms.txt">llms.txt</a></li></ul></div>
        <div><h5>UIX for Figma</h5><ul><li><a href="https://uixdesign.pagestro.com/">The Figma plugin</a></li><li><a href="https://uixdesign.pagestro.com/pricing">UIX Pro</a></li><li><a href="https://pagestro.com">Pagestro</a></li></ul></div>
      </div>
      <div className="fbot"><span>Open source under the MIT licence. Icons in the components are Lucide shapes (ISC).</span><span>© 2026 Pagestro</span></div>
    </div></footer>
  );
}

function Search({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { id, set } = usePreset();
  const toast = useToast();
  const go = (to: string) => { onClose(); setTimeout(() => navigate(to), 60); };
  const comps = React.useMemo(() => allPaths().filter(p => p.startsWith("/components/")).map(p => p.split("/")[2]), []);
  return (
    <div data-preset={id}>
      <CommandPalette open={open} onClose={onClose} placeholder="Search components, themes and docs" showFooter groups={[
        { heading: "Pages", items: [["Introduction", "/docs"], ["Installation", "/docs/installation"], ["Theming", "/docs/theming"], ["Dark mode", "/docs/dark-mode"], ["CLI", "/docs/cli"], ["MCP and AI agents", "/docs/mcp"], ["Figma", "/docs/figma"], ["Examples", "/examples"], ["Templates", "/templates"]].map(([l, h]) => ({ id: h, label: l, icon: <ArrowRight />, onSelect: () => go(h) })) },
        { heading: "Components", items: comps.map(c => ({ id: `c-${c}`, label: titleCase(c), icon: <Folder />, onSelect: () => go(`/components/${c}`) })) },
        { heading: "Themes", items: ALL.map(p => ({ id: `t-${p.id}`, label: p.name, icon: <Star />, onSelect: () => { onClose(); set(p.id); toast(`“${p.name}” is on.`); } })) },
      ]} />
    </div>
  );
}

function Shell() {
  const { path } = useRoute();
  const [search, setSearch] = React.useState(false);
  const Current = matchRoute(path).route.component;
  React.useEffect(() => {
    const { title, description } = titleOf(path);
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [path]);
  React.useEffect(() => {
    const on = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch(s => !s); } };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  return (
    <div className="site">
      <a className="sr skip" href="#main">Skip to content</a>
      <ChromeSync />
      <Nav onSearch={() => setSearch(true)} />
      <div id="main"><Current /></div>
      <Footer />
      <Search open={search} onClose={() => setSearch(false)} />
    </div>
  );
}

/** `url` is the page's path: given by entry-server when pre-rendering, and by main.tsx from location on the client. */
export default function App({ url }: { url?: string }) {
  return <PresetProvider><LookProvider><ToastProvider><RouterProvider url={url} routes={routes} load={preloadPath}><Shell /></RouterProvider></ToastProvider></LookProvider></PresetProvider>;
}
