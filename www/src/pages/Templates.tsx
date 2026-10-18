import * as React from "react";
import { Callout, PageHeader } from "../site/Docs";
import { BLOCKS, PAGES, type Tpl } from "../home/templates-html";
import "./themes.css";

/* UIX Pro page templates and marketing blocks, shown as small mockups. They come with UIX Pro, not with the free library. */

const PRO = "https://uixdesign.pagestro.com/pricing";
type Show = "all" | "pages" | "blocks";
const FILTERS: [Show, string][] = [["all", "All"], ["pages", "Pages"], ["blocks", "Blocks"]];

const Card = ({ t, kind }: { t: Tpl; kind: string }) => (
  <div className="tpl" role="group" aria-label={`${t.url}, ${kind}`}>
    <div className="cw-bar"><i /><i /><i /><span>{t.url}</span><em>{t.tag}</em></div>
    <div className="tpv" aria-hidden dangerouslySetInnerHTML={{ __html: t.html }} />
  </div>
);

export default function Templates() {
  const [show, setShow] = React.useState<Show>("all");
  const pages = show !== "blocks", blocks = show !== "pages";
  return (
    <main className="wrap th-page" id="content">
      <PageHeader title="Templates and blocks" lead="Whole pages and marketing sections, built from the same components and wearing whatever theme you pick." />
      <Callout tone="pro">
        <b>These come with UIX Pro.</b> The free library gives you the components and themes. <a href={PRO}>See UIX Pro</a>.
        <ul className="th-list">
          <li>Marketing blocks: hero, pricing, testimonials, CTA and more</li>
          <li>Page templates: dashboard, sign-in, settings, pricing, landing</li>
        </ul>
      </Callout>
      <div className="moods" role="group" aria-label="Show" style={{ marginTop: 24 }}>
        {FILTERS.map(([k, label]) => <button key={k} type="button" aria-pressed={show === k} onClick={() => setShow(k)}>{label}</button>)}
      </div>
      <div className="th-tgrid">
        {pages && PAGES.map(t => <Card key={t.url} t={t} kind="page template" />)}
        {blocks && BLOCKS.map(t => <Card key={t.url} t={t} kind="block" />)}
      </div>
      <div className="th-closer">
        <h2>Start from a finished page</h2>
        <p>Templates and blocks are part of UIX Pro. Pick one, put your content in, and your brand carries through.</p>
        <a className="btn b-brand lg" href={PRO}>See UIX Pro</a>
      </div>
    </main>
  );
}
