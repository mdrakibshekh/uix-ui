import * as React from "react";

/* A tiny router: pushState links, popstate, `:param` patterns. No window access during render:
   the first render uses the `url` prop (the server's URL, or location on the client passed in by main.tsx). */

const BASE = import.meta.env.BASE_URL; // "/ui/"
export type Params = Record<string, string>;
export type Route = { path: string; params: Params; query: URLSearchParams };

const stripBase = (p: string) => (p.startsWith(BASE) ? "/" + p.slice(BASE.length) : p === BASE.slice(0, -1) ? "/" : p);
const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";
const href = (path: string, hash = "") => (path === "/" ? BASE : BASE + clean(path).slice(1)) + hash;

/** Match "/components/:slug" style patterns; returns the params or null. */
export function matchPath(pattern: string, path: string): Params | null {
  if (pattern === "*") return {};
  const a = pattern.split("/"), b = path.split("/");
  if (a.length !== b.length) return null;
  const params: Params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

type Loc = { path: string; search: string };
const parse = (url: string): Loc => {
  const [rest] = url.split("#");
  const [p, q = ""] = rest.split("?");
  return { path: clean(stripBase(p)), search: q };
};

/** The route path for a URL ("/ui/themes/" → "/themes"). */
export const pathOf = (url: string) => parse(url).path;

const Ctx = React.createContext<{ route: Route; go: (to: string, replace?: boolean) => void }>(null!);
let current: ((to: string) => void) | null = null;

export function useRoute(): Route { return React.useContext(Ctx).route; }

/** Go to a route path ("/themes/ember-ledger", optionally "#hash"). Works anywhere after mount. */
export function navigate(to: string) { if (current) current(to); else location.assign(href(to)); }

/** `load(path)` runs before each navigation commits (the page's code chunk), so the old page stays until the new one is ready. */
export function RouterProvider({ url = "/", routes, load, children }: { url?: string; routes: { path: string }[]; load?: (path: string) => Promise<unknown>; children: React.ReactNode }) {
  const [loc, setLoc] = React.useState<Loc>(() => parse(url));
  const scrollTo = React.useRef<string | null>(null);

  const go = React.useCallback((to: string, replace?: boolean) => {
    const [p, h = ""] = to.split("#");
    const next = p === "" ? parse(location.pathname + location.search) : parse(p);
    const url = (p === "" ? location.pathname + location.search : href(next.path, next.search && "?" + next.search)) + (h && "#" + h);
    const commit = () => {
      history[replace ? "replaceState" : "pushState"](null, "", url);
      scrollTo.current = h ? "#" + h : "top";
      setLoc({ ...next });
    };
    if (load) load(next.path).then(commit, commit); else commit();
  }, [load]);
  React.useEffect(() => { current = go; return () => { current = null; }; }, [go]);

  React.useEffect(() => {
    const onPop = () => {
      const next = parse(location.pathname + location.search), hash = location.hash;
      const commit = () => { setLoc(next); scrollTo.current = hash || "top"; };
      if (load) load(next.path).then(commit, commit); else commit();
    };
    window.addEventListener("popstate", onPop);
    // A pasted /ui/#section URL: scroll once the page is up.
    if (location.hash) scrollTo.current = location.hash;
    setLoc(l => { const now = parse(location.pathname + location.search); return now.path === l.path && now.search === l.search ? l : now; });
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // After each navigation: scroll to the hash target, or to the top on a new page.
  React.useEffect(() => {
    const t = scrollTo.current;
    if (!t) return;
    scrollTo.current = null;
    if (t === "top") { window.scrollTo(0, 0); return; }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(decodeURIComponent(t.slice(1)))?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, [loc]);

  const route = React.useMemo<Route>(() => {
    let params: Params = {};
    for (const r of routes) { const m = matchPath(r.path, loc.path); if (m) { params = m; break; } }
    return { path: loc.path, params, query: new URLSearchParams(loc.search) };
  }, [loc, routes]);
  return <Ctx.Provider value={{ route, go }}>{children}</Ctx.Provider>;
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: string };
/** `to` is a route path ("/themes"), a path with a hash ("/#themes"), or just a hash ("#top"). */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, onClick, ...rest }, ref) {
  const { go } = React.useContext(Ctx);
  const [p, h = ""] = to.split("#");
  const external = /^[a-z]+:/i.test(to);
  return (
    <a
      ref={ref}
      {...rest}
      href={external ? to : p === "" ? "#" + h : href(p.split("?")[0], (p.includes("?") ? "?" + p.split("?")[1] : "") + (h ? "#" + h : ""))}
      onClick={e => {
        onClick?.(e);
        if (e.defaultPrevented || external || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === "_blank" || rest.download != null) return;
        e.preventDefault();
        go(to);
      }}
    />
  );
});
