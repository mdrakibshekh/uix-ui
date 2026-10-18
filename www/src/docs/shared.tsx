import * as React from "react";
import { GUIDES, type NavGroup, type NavItem, type PmId, type TocItem } from "../site/Docs";

/* Pieces shared by the docs guide pages: the sidebar groups, the page type and a small tab strip. */

export const NAV: NavGroup[] = [
  GUIDES,
  { title: "Library", items: [{ label: "Components", to: "/components" }, { label: "Themes", to: "/themes" }, { label: "Examples", to: "/examples" }, { label: "Templates", to: "/templates" }] },
];

export type DocPage = { slug: string; title: string; lead: React.ReactNode; toc: TocItem[]; Body: React.ComponentType };

/** Docs > Page breadcrumbs. `hash` keeps the two crumbs of the introduction apart (both live at /docs). */
export const crumbs = (title: string, to: string): NavItem[] => [{ label: "Docs", to: "/docs" }, { label: title, to }];

export const GITHUB = "https://github.com/mdrakibshekh/uix-ui";
export const SITE = "https://uixdesign.pagestro.com";
export const MCP_URL = `${SITE}/mcp`;

/** A row of tabs; the panel under it is whatever you render for the selected value. Arrow keys move between tabs. */
export function Tabs<T extends string>({ label, items, value, onChange, children }: { label: string; items: readonly { id: T; name: string }[]; value: T; onChange: (v: T) => void; children: React.ReactNode }) {
  const base = React.useId();
  const key = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = items[(i + d + items.length) % items.length].id;
    onChange(next);
    document.getElementById(`${base}-${next}`)?.focus();
  };
  return (
    <div className="dp-tabbed">
      <div className="dp-tabs" role="tablist" aria-label={label}>
        {items.map((t, i) => (
          <button key={t.id} type="button" role="tab" id={`${base}-${t.id}`} aria-controls={`${base}-panel`} aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1} onClick={() => onChange(t.id)} onKeyDown={e => key(e, i)}>{t.name}</button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-${value}`} className="dp-panel">{children}</div>
    </div>
  );
}

/** Scrollable table in the docs look. */
export function Table({ label, head, rows }: { label: string; head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="dtable" role="region" aria-label={label} tabIndex={0}>
      <table>
        <thead><tr>{head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export { Install } from "../site/Docs";
