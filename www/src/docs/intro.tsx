import registry from "../../../registry/registry.json";
import { ALL, COUNTS } from "../lib";
import { Link } from "../router";
import { Code, H2 } from "../site/Docs";
import { GITHUB, type DocPage } from "./shared";

const COMPONENTS = registry.items.filter(i => i.type === "registry:ui" && i.name !== "icons").length;

const PRINCIPLES: [string, string][] = [
  ["You own the code", "The CLI copies plain files into your project. There is no package to keep in sync, so you can read, change and delete anything."],
  ["Native HTML elements", "Components use what the browser already has: dialog, the popover attribute and details. No Radix and no other UI library."],
  ["Three small dependencies", "class-variance-authority, clsx and tailwind-merge. That is the whole list."],
  ["Accessible", "Focus states and keyboard support work with or without motion. Animations follow the reduced-motion setting."],
  ["Themes are full design systems", "A theme sets colour ramps, type, spacing, radius, shadows and both light and dark colours. Swap it with one command."],
];

const FAQ: [string, string][] = [
  ["Is uix-ui really free?", `Yes. The components, the CLI, the Tailwind themes and the ${COUNTS.free} free presets are MIT licensed. Use them in personal and commercial projects without asking.`],
  ["What does UIX Pro add?", `Marketing blocks, nine visual styles and all ${COUNTS.all} themes, installed with the same CLI and your licence key. Page templates come with the Figma plugin.`],
  ["How is it different from shadcn/ui?", "Same idea: you copy components into your app and own them. uix-ui adds full design-system themes (ramps, type, spacing, radius, light and dark), a Figma library that matches the code, and an MCP server for AI agents. It also uses the same registry format, so the shadcn CLI can install uix-ui items."],
  ["Do I need Radix or another UI library?", "No. Components use native HTML: dialog, the popover attribute and details. The only dependencies are class-variance-authority, clsx and tailwind-merge."],
  ["Which frameworks work?", "Any React 18 or 19 app with Tailwind CSS v4: Vite, Next.js (App or Pages router), Remix, Astro with React. Server Components are fine; interactive components are marked \"use client\"."],
  ["How does dark mode work?", "Every theme ships light and dark tokens. Set data-theme=\"dark\" on the html element and everything follows, including the animations."],
  ["Can I use my own brand instead of a preset?", "Yes. Make your system in the UIX Figma plugin, then install it as your own theme. With Pro, your components follow your own sizes, shapes and styles too."],
  ["Will the animations hurt accessibility?", "They follow the reduced-motion setting: if someone turns motion off, components appear without moving. Focus states and keyboard support work with or without motion."],
];

const NEXT: [string, string, string][] = [
  ["Installation", "/docs/installation", "Pick your framework and add your first component."],
  ["Theming", "/docs/theming", "How tokens work and how to switch or change a theme."],
  ["Dark mode", "/docs/dark-mode", "One attribute on the html element, plus a toggle."],
  ["CLI", "/docs/cli", "Every command and flag."],
  ["MCP and AI agents", "/docs/mcp", "Let Claude Code, Cursor or VS Code build with your system."],
  ["Figma", "/docs/figma", "UIX for Figma, the sister product with the same names."],
];

function Body() {
  return (
    <>
      <section>
        <H2 id="what-is-uix-ui">What is uix-ui</H2>
        <p>uix-ui is a set of open-source React components and Tailwind CSS v4 themes. You run one command and the files land in your project, so the code is yours. It is MIT licensed.</p>
        <p>There are {COMPONENTS} components and {ALL.length} themes: the UIX default and {COUNTS.free} free presets. Each theme comes with light and dark colours. The components are made by the same generator as the UIX Figma plugin.</p>
      </section>
      <section>
        <H2 id="in-three-commands">In three commands</H2>
        <p>Set up a theme, add the components you want, and switch themes whenever you like.</p>
        <Code lang="sh" code={`npx uix-ui init --preset beetroot-harrow   # theme, cn() helper, components.json\nnpx uix-ui add button card input badge alert\nnpx uix-ui theme lagoon-stretch            # switch to another free theme`} />
        <p>The <Link to="/docs/installation">installation guide</Link> walks through it for Next.js, Vite, Astro and existing apps.</p>
      </section>
      <section>
        <H2 id="principles">Principles</H2>
        <div className="dp-feat">{PRINCIPLES.map(([t, d]) => <div key={t}><b>{t}</b><span>{d}</span></div>)}</div>
      </section>
      <section>
        <H2 id="uix-for-figma">How it relates to UIX for Figma</H2>
        <p>UIX for Figma is a separate sister product. It builds the same design system inside Figma, with the same names for components, variants and sizes. A Figma Button / Primary / md is a <code>{'<Button variant="primary" size="md">'}</code> in code.</p>
        <p>You do not need Figma to use uix-ui. Read more in <Link to="/docs/figma">the Figma guide</Link>.</p>
      </section>
      <section>
        <H2 id="faq">Questions</H2>
        <div className="dp-faq">
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
        <p>Anything else? Open an issue on <a href={GITHUB}>GitHub</a>.</p>
      </section>
      <section>
        <H2 id="where-next">Where to next</H2>
        <div className="dp-cards">{NEXT.map(([t, to, d]) => <Link key={to} to={to} className="dp-card"><b>{t}</b><span>{d}</span></Link>)}</div>
      </section>
    </>
  );
}

const page: DocPage = {
  slug: "", title: "Introduction",
  lead: "uix-ui is a set of React components and Tailwind CSS v4 themes that you copy into your project and own.",
  toc: [["what-is-uix-ui", "What is uix-ui"], ["in-three-commands", "In three commands"], ["principles", "Principles"], ["uix-for-figma", "How it relates to UIX for Figma"], ["faq", "Questions"], ["where-next", "Where to next"]].map(([id, label]) => ({ id, label })),
  Body,
};
export default page;
