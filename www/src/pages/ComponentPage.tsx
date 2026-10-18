import { DocsLayout, PageHeader, H2, H3, Code, Preview, Install, PropsTable, Callout, PrevNext, type TocItem, type PropRow } from "../site/Docs";
import { Link, useRoute } from "../router";
import { categoryOf } from "../component-categories";
import docs from "../component-docs.json";
import { EXAMPLES, usageOf } from "../examples";
import { componentNav, DOCS } from "./Components";
import "./components.css";

type Full = { name: string; description: string; exports: string[]; uses: string[]; dependencies: string[]; registryDependencies: string[]; props: PropRow[]; more: { name: string; props: PropRow[] }[] };
const FULL = docs as unknown as Record<string, Full>;
const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ComponentPage() {
  const { slug } = useRoute().params;
  const doc = FULL[slug];
  const cat = categoryOf(slug);
  if (!doc || !cat) {
    return (
      <DocsLayout nav={componentNav()}>
        <div className="cx-missing">
          <h1>We could not find that component</h1>
          <p>There is no component called “{slug}”. It may have been renamed, or the link has a typo. The full list is one click away.</p>
          <Link to="/components" className="btn">See all components</Link>
        </div>
      </DocsLayout>
    );
  }

  const examples = EXAMPLES[slug] ?? [];
  const [main, ...extra] = examples;
  const tables = [{ name: `${doc.name} props`, props: doc.props }, ...doc.more].filter(t => t.props.length);
  const idx = cat.items.indexOf(slug);
  const link = (s?: string) => (s ? { label: DOCS[s].name, to: `/components/${s}` } : undefined);
  const plain = examples.findIndex(e => !e.code.includes("React.use"));
  const usage = `import { ${doc.exports.join(", ")} } from "@/components/ui/${slug}";\n\n${usageOf(slug, plain < 0 ? 0 : plain)}\n`;
  const exId = (t: string, i: number) => `example-${slugify(t) || i}`;

  const toc: TocItem[] = [
    { id: "installation", label: "Installation" },
    { id: "usage", label: "Usage" },
    ...(extra.length ? [{ id: "examples", label: "Examples" }, ...extra.map((e, i) => ({ id: exId(e.title, i), label: e.title, depth: 3 as const }))] : []),
    { id: "props", label: "Props" },
    { id: "dependencies", label: "Dependencies" },
  ];

  return (
    <DocsLayout nav={componentNav()} toc={toc}>
      <PageHeader
        crumbs={[{ label: "Components", to: "/components" }, { label: cat.name, to: `/components#${cat.id}` }, { label: doc.name, to: `/components/${slug}` }]}
        title={doc.name}
        lead={doc.description}
      />
      {main ? <div className="cx-hero"><Preview code={main.code}>{main.render()}</Preview></div> : null}

      <H2 id="installation">Installation</H2>
      <Install cmd={run => `${run} uix-ui@latest add ${slug}`} />
      <p className="cx-note">This copies the file into <code>components/ui/{slug}.tsx</code> in your project. <code>npx shadcn@latest add @uix/{slug}</code> works too.</p>

      <H2 id="usage">Usage</H2>
      <Code code={usage} file={`${slug}.tsx`} />

      {extra.length ? (
        <>
          <H2 id="examples">Examples</H2>
          {extra.map((e, i) => (
            <section key={e.title}>
              <H3 id={exId(e.title, i)}>{e.title}</H3>
              <Preview code={e.code}>{e.render()}</Preview>
            </section>
          ))}
        </>
      ) : null}

      <H2 id="props">Props</H2>
      {tables.length === 0 ? <PropsTable rows={[]} /> : tables.map(t => (
        <section key={t.name}>
          {tables.length > 1 ? <H3 id={`props-${slugify(t.name)}`}>{t.name}</H3> : null}
          <PropsTable rows={t.props} />
        </section>
      ))}
      <p className="cx-sub">Everything else is passed to the root element, so <code>className</code>, <code>aria-*</code> and event handlers work as usual.</p>

      <H2 id="dependencies">Dependencies</H2>
      <p className="cx-sub">Installed for you by the CLI.</p>
      <ul className="cx-deps" aria-label="Packages">{doc.dependencies.map(d => <li key={d}><code>{d}</code></li>)}</ul>
      <ul className="cx-deps" aria-label="Other uix-ui files">
        {doc.registryDependencies.map(d => <li key={d}><code>{d.replace("@uix/", "") === "utils" ? "lib/utils.ts" : "components/ui/icons.tsx"}</code></li>)}
        {doc.uses.map(u => <li key={u}><Link to={`/components/${u}`}>{DOCS[u]?.name ?? u}</Link></li>)}
      </ul>
      {doc.exports.length > 1 ? <Callout>This file exports {doc.exports.length} parts: {doc.exports.join(", ")}. Use only the ones you need.</Callout> : null}

      <PrevNext prev={link(cat.items[idx - 1])} next={link(cat.items[idx + 1])} />
    </DocsLayout>
  );
}
