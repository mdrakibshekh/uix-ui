import * as React from "react";
import { byId, COUNTS, usePreset } from "../lib";
import { Link } from "../router";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { useDemo } from "../home/look";
import { Callout, Code, H2, H3, Preview } from "../site/Docs";
import { Install, Table, type DocPage } from "./shared";

const PICKS = ["uix", "lagoon-stretch", "ember-ledger", "beetroot-harrow", "custard-schoolbook", "sonata-whisker"];

// Semantic tokens from the default theme (styles/uix.css): CSS variable, Tailwind class, light value, dark value.
const TOKENS: [string, string, string, string][] = [
  ["--bg-canvas", "bg-canvas", "neutral-50", "neutral-950"],
  ["--bg-surface", "bg-surface", "white", "neutral-900"],
  ["--bg-brand", "bg-brand", "primary-600", "primary-500"],
  ["--bg-brand-hover", "bg-brand-hover", "primary-700", "primary-400"],
  ["--bg-danger", "bg-danger", "error-500", "error-500"],
  ["--text-primary", "text-fg-primary", "neutral-900", "neutral-50"],
  ["--text-secondary", "text-fg-secondary", "neutral-600", "neutral-300"],
  ["--text-on-brand", "text-fg-on-brand", "white", "white"],
  ["--text-brand", "text-fg-brand", "primary-600", "primary-400"],
  ["--border-default", "border-line-default", "neutral-200", "neutral-700"],
  ["--border-focus", "border-line-focus", "primary-400", "primary-500"],
];
const SWATCHES = ["--bg-canvas", "--bg-surface", "--bg-brand", "--bg-brand-hover", "--bg-secondary", "--bg-danger", "--bg-success", "--bg-warning"];

/** Live colours of the picked theme. They sit inside the demo wrapper, so they follow the theme and light or dark. */
function Swatches() {
  const demo = useDemo();
  return (
    <div className="dp-tokens" {...demo}>
      {SWATCHES.map(v => <div key={v}><i style={{ background: `var(${v})` }} aria-hidden /><code>{v}</code></div>)}
    </div>
  );
}

function ThemePicker() {
  const { id, set } = usePreset();
  return (
    <div className="dp-chips" role="group" aria-label="Pick a theme">
      {PICKS.map(p => <button key={p} type="button" aria-pressed={id === p} onClick={() => set(p)}>{byId(p).name}</button>)}
    </div>
  );
}

function Body() {
  return (
    <>
      <section>
        <H2 id="how-a-theme-works">How a theme works</H2>
        <p>A theme is one CSS file, <code>src/styles/uix.css</code>. It is a Tailwind v4 theme: colour ramps, a type scale, spacing, radius and shadows, in light and in dark.</p>
        <p>Components never use raw colours. They use named tokens such as <code>bg-brand</code> and <code>text-fg-primary</code>, and those point at the ramps. Change the file and every component changes with it.</p>
        <H3 id="ramps">Colour ramps</H3>
        <p>Each ramp runs from 50 (lightest) to 950 (darkest), for example <code>--color-primary-500</code>. The ramps are <code>primary</code>, <code>secondary</code>, <code>neutral</code>, and the feedback colours <code>error</code>, <code>warning</code> and <code>success</code>.</p>
        <H3 id="semantic-tokens">Semantic tokens</H3>
        <p>Semantic tokens say what a colour is for. Each one points at a ramp step, and the dark values are swapped in when <code>data-theme=&quot;dark&quot;</code> is set. Here is a part of the default theme.</p>
        <Table label="Semantic tokens" head={["Variable", "Tailwind class", "Light", "Dark"]} rows={TOKENS.map(([v, c, l, d]) => [<code key="v">{v}</code>, <code key="c">{c}</code>, l, d])} />
        <p>Spacing (<code>--spacing-4</code>), radius (<code>--radius-md</code>), fonts (<code>--font-heading</code>, <code>--font-body</code>, <code>--font-mono</code>) and the type scale (<code>--text-heading-1</code>, <code>--text-body-large</code> and so on) are tokens too.</p>
      </section>
      <section>
        <H2 id="switch-themes">Switch themes</H2>
        <p>One command swaps the theme. It rewrites <code>src/styles/uix.css</code> and updates the font links. Your components stay exactly as they are. Leave the name out, or use <code>uix</code>, for the default.</p>
        <Install cmd={run => `${run} uix-ui@latest theme ember-ledger`} />
        <p>Browse all of them on the <Link to="/themes">themes page</Link>.</p>
      </section>
      <section>
        <H2 id="try-it">Try it</H2>
        <p>Pick a theme. The whole page changes with it, and so do the components below.</p>
        <ThemePicker />
        <Swatches />
        <Preview code={`<Button>Save</Button>\n<Button variant="outline">Cancel</Button>\n<Badge color="success">Paid</Badge>\n<Input label="Email" placeholder="you@example.com" />\n<Switch label="Email me updates" />`}>
          <Button>Save</Button>
          <Button variant="outline">Cancel</Button>
          <Badge color="success">Paid</Badge>
          <Input label="Email" placeholder="you@example.com" />
          <Switch label="Email me updates" />
        </Preview>
      </section>
      <section>
        <H2 id="customise-tokens">Customise tokens</H2>
        <p>Change a token in your own CSS, after the theme import. Do not edit <code>uix.css</code>: running <code>init</code> or <code>theme</code> writes it again.</p>
        <Code lang="css" file="src/index.css" code={`@import "tailwindcss";\n@import "./styles/uix.css";\n\n/* Your changes go after the import. */\n:root {\n  --bg-brand: var(--color-primary-700);\n  --radius-md: 6px;\n}\n[data-theme="dark"] {\n  --bg-brand: var(--color-primary-400);\n}`} />
        <p>Prefer to keep the theme out of your source? The <code>@uix-ui/tailwind</code> package has the same themes: <code>{'@import "@uix-ui/tailwind/themes/<preset>.css";'}</code>.</p>
      </section>
      <section>
        <H2 id="visual-styles">Visual styles</H2>
        <Callout tone="pro">
          <b>UIX Pro.</b> Visual styles change how the components look without touching your tokens: glass, clay, neon, brutalism and more. Set <code>data-skin</code> on <code>html</code> or on any wrapper, and everything inside it follows. Without it you get the Modern look. Add the styles once with <code>UIX_LICENSE=&lt;key&gt; npx uix-ui add skins</code>; the CLI imports them into your CSS.
        </Callout>
        <Code lang="tsx" file="index.html" code={`<html data-skin="minimal" data-theme="dark">\n\n<section data-skin="glass">\n  <!-- components in here wear the Glass style -->\n</section>`} />
        <p>Pro also covers <Link to="/templates">templates and blocks</Link> and all {COUNTS.all} themes. See <a href="https://uixdesign.pagestro.com/pricing">pricing</a>.</p>
      </section>
    </>
  );
}

const page: DocPage = {
  slug: "theming", title: "Theming",
  lead: "A theme is a CSS file of tokens. Swap the file and every component takes on the new look.",
  toc: [
    { id: "how-a-theme-works", label: "How a theme works" }, { id: "ramps", label: "Colour ramps", depth: 3 }, { id: "semantic-tokens", label: "Semantic tokens", depth: 3 },
    { id: "switch-themes", label: "Switch themes" }, { id: "try-it", label: "Try it" }, { id: "customise-tokens", label: "Customise tokens" }, { id: "visual-styles", label: "Visual styles" },
  ],
  Body,
};
export default page;
