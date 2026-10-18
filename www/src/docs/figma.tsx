import type * as React from "react";
import { Link } from "../router";
import { Callout, Code, H2 } from "../site/Docs";
import { SITE, Table, type DocPage } from "./shared";

const NAMES: React.ReactNode[][] = [
  ["Button / Primary / md", <code key="a">{'<Button variant="primary" size="md">'}</code>],
  ["Button / Outline / lg", <code key="b">{'<Button variant="outline" size="lg">'}</code>],
  ["Button / Destructive / sm", <code key="c">{'<Button variant="destructive" size="sm">'}</code>],
];

function Body() {
  return (
    <>
      <section>
        <H2 id="the-plugin">UIX for Figma</H2>
        <p>UIX for Figma is a separate product, a plugin for Figma. It turns one brand colour into a complete design system inside your file: colour scales, type, tokens, light and dark themes, components and documentation, all as native Figma variables and styles.</p>
        <p>uix-ui is its sister. The components here come from the same generator, so what you design in Figma and what you ship in React stay in step. You can use either one without the other.</p>
        <p><a href={`${SITE}/`}>See the Figma plugin</a>, or read about <a href={`${SITE}/pricing`}>UIX Pro</a>. One Pro key works for both products.</p>
      </section>
      <section>
        <H2 id="same-names">The same names</H2>
        <p>A component, a variant and a size have the same names in both places. Read a Figma layer name and you know the code.</p>
        <Table label="Figma names and code" head={["In Figma", "In code"]} rows={NAMES} />
        <p>Button has the variants primary, secondary, soft, outline, ghost, destructive and link, and the sizes sm, md and lg. See every component on the <Link to="/components">components page</Link>.</p>
      </section>
      <section>
        <H2 id="design-tokens">Tokens and code</H2>
        <p>The plugin can export your design system as CSS variables or Tailwind v4 tokens for free. The React export, which writes components like the ones in uix-ui, is part of Pro.</p>
        <Callout tone="pro">
          <b>UIX Pro.</b> Your own system, made in the Figma plugin, becomes a private registry. Install it with your licence key: <code>UIX_LICENSE=&lt;key&gt; npx uix-ui add @uix-pro/&lt;name&gt;</code>.
        </Callout>
      </section>
      <section>
        <H2 id="bring-your-own-system">Bring your own system</H2>
        <p>You do not have to use a preset. Make your system in the UIX Figma plugin, then install it as your own theme. With Pro, your components follow your own sizes, shapes and styles too.</p>
        <p>Prefer to start from a ready-made look? <Link to="/themes">Pick a theme</Link> and change tokens in your own CSS, as described in <Link to="/docs/theming">theming</Link>.</p>
        <Code lang="sh" code={`npx uix-ui init --preset lagoon-stretch`} />
      </section>
      <section>
        <H2 id="links">Links</H2>
        <ul>
          <li><a href={`${SITE}/`}>UIX for Figma</a></li>
          <li><a href={`${SITE}/presets`}>All presets</a></li>
          <li><a href={`${SITE}/pricing`}>Pricing</a></li>
        </ul>
      </section>
    </>
  );
}

const page: DocPage = {
  slug: "figma", title: "Figma",
  lead: "UIX for Figma is the sister product. It builds the same design system in Figma, with the same names as the code.",
  toc: [{ id: "the-plugin", label: "UIX for Figma" }, { id: "same-names", label: "The same names" }, { id: "design-tokens", label: "Tokens and code" }, { id: "bring-your-own-system", label: "Bring your own system" }, { id: "links", label: "Links" }],
  Body,
};
export default page;
