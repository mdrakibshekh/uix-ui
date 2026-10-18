import { useRoute, Link } from "../router";
import { DocsLayout, GUIDES, H2, PageHeader, PrevNext } from "../site/Docs";
import { crumbs, NAV, type DocPage } from "../docs/shared";
import intro from "../docs/intro";
import installation from "../docs/installation";
import theming from "../docs/theming";
import darkMode from "../docs/dark-mode";
import cli from "../docs/cli";
import mcp from "../docs/mcp";
import figma from "../docs/figma";
import "./docs-pages.css";

/* /docs and /docs/:page. One module per guide in src/docs; this file picks the page and wraps it in the docs layout. */
const PAGES: DocPage[] = [intro, installation, theming, darkMode, cli, mcp, figma];

function NotFound({ slug }: { slug: string }) {
  return (
    <DocsLayout nav={NAV}>
      <PageHeader crumbs={[{ label: "Docs", to: "/docs" }, { label: "Not found", to: "/docs#guides" }]} title="That page is not in the docs" lead={<>There is no guide called &ldquo;{slug}&rdquo;. It may have moved, or the link may have a typo.</>} />
      <section className="dp-nf">
        <H2 id="guides">Try one of these</H2>
        <div className="dp-cards">{GUIDES.items.map(i => <Link key={i.to} to={i.to} className="dp-card"><b>{i.label}</b></Link>)}</div>
        <p>Or look through the <Link to="/components">components</Link>, <Link to="/themes">themes</Link> or <Link to="/examples">examples</Link>.</p>
      </section>
    </DocsLayout>
  );
}

export default function Docs() {
  const slug = useRoute().params.page ?? "";
  const i = PAGES.findIndex(p => p.slug === slug);
  if (i < 0) return <NotFound slug={slug} />;
  const { title, lead, toc, Body } = PAGES[i];
  const nav = (p?: DocPage) => (p ? GUIDES.items[PAGES.indexOf(p)] : undefined);
  return (
    <DocsLayout nav={NAV} toc={toc}>
      <PageHeader crumbs={crumbs(title, i === 0 ? `/docs#${toc[0].id}` : `/docs/${slug}`)} title={title} lead={lead} />
      <Body />
      <PrevNext prev={nav(PAGES[i - 1])} next={nav(PAGES[i + 1])} />
    </DocsLayout>
  );
}
