import type * as React from "react";
import { Link } from "../router";
import { Callout, Code, H2, H3 } from "../site/Docs";
import { Install, Table, type DocPage } from "./shared";

const FLAGS: React.ReactNode[][] = [
  [<code key="a">--preset &lt;id&gt;</code>, <code key="b">init</code>, <>The theme to set up. Leave it out for the UIX default. <code>theme</code> also accepts it in place of the name.</>],
  [<code key="c">--registry &lt;url|folder&gt;</code>, <code key="d">init</code>, "Where components and themes come from: a URL or a local folder. The default is https://uixdesign.pagestro.com/ui/r."],
  [<code key="e">--overwrite</code>, <code key="f">add</code>, "Replace files that already exist. Without it, a changed file is skipped and the CLI says so."],
  [<code key="g">--no-install</code>, <><code>init</code>, <code>add</code></>, "Do not run the package manager. Print the install command instead."],
  [<code key="h">--help</code>, "any", <>Print the command list. <code>help</code> and <code>-h</code> do the same, and so does running the CLI with no command.</>],
];

const MESSAGES: React.ReactNode[][] = [
  [<code key="a">no components.json here</code>, <>Run <code>uix-ui init</code> first.</>],
  [<code key="b">name at least one component</code>, <><code>add</code> needs a name, for example <code>uix-ui add button</code>.</>],
  [<code key="c">is a UIX Pro item</code>, <>The registry answered 401 or 403. Set <code>UIX_LICENSE</code> to your key.</>],
  [<code key="d">is not in the registry</code>, "The name does not exist, or the folder you passed does not have it."],
  [<code key="e">unknown command</code>, "The CLI prints the command list after this message."],
];

function Body() {
  return (
    <>
      <section>
        <H2 id="overview">Overview</H2>
        <p>The CLI is called <code>uix-ui</code>. It has no dependencies and needs Node 18 or newer. Run it with your package manager&apos;s runner; the tabs below show each one.</p>
        <Code lang="sh" file="Command list" code={`npx uix-ui init [--preset <id>] [--registry <url|folder>]   set up the theme, utils and components.json\nnpx uix-ui add <component...>                               copy components into your app\nnpx uix-ui theme <preset>                                   switch to another UIX preset (uix = default)\nnpx uix-ui list                                             components and themes in the registry`} />
        <p>Every command except <code>init</code> reads <code>components.json</code>, so run <code>init</code> first.</p>
      </section>
      <section>
        <H2 id="init">init</H2>
        <p>Sets up a project. It writes <code>components.json</code> and the theme CSS, imports the theme in your main CSS file, adds the <code>cn()</code> helper and loads the theme&apos;s fonts. Run it in the folder that holds your <code>package.json</code>.</p>
        <Install cmd={run => `${run} uix-ui@latest init --preset lagoon-stretch`} />
        <Code lang="sh" file="Output" code={`  wrote   components.json\n  wrote   src/styles/uix.css\n  fonts   Sora, Plus Jakarta Sans, JetBrains Mono → index.html\n  updated src/index.css\n  wrote   src/lib/utils.ts\n\nDone. Next: npx uix-ui add button card input\nDark mode: <html data-theme="dark">. Other presets: npx uix-ui theme <preset>.`} />
        <p>It warns if Tailwind CSS is not installed yet, and stops if it finds Tailwind CSS v3. The <Link to="/docs/installation#what-init-writes">installation guide</Link> lists every file it touches.</p>
      </section>
      <section>
        <H2 id="add">add</H2>
        <p>Copies components into your app, with everything they depend on. Missing packages are installed with the package manager your lockfile points to (npm, pnpm, yarn or bun). Input needs the icons file, so it comes along.</p>
        <Install cmd={run => `${run} uix-ui@latest add button card input`} />
        <Code lang="sh" file="Output" code={`  wrote   src/components/ui/button.tsx\n  wrote   src/components/ui/card.tsx\n  wrote   src/components/ui/icons.tsx\n  wrote   src/components/ui/input.tsx\n\nnpm install class-variance-authority`} />
        <H3 id="add-names">Names</H3>
        <p>A plain name such as <code>button</code> comes from the <code>@uix</code> registry. You can also write it out: <code>@uix/button</code>. Pro items use <code>@uix-pro/&lt;name&gt;</code>.</p>
      </section>
      <section>
        <H2 id="theme">theme</H2>
        <p>Switches the project to another preset. It rewrites <code>src/styles/uix.css</code> and updates the font links. Components are not touched. Use <code>uix</code> for the default.</p>
        <Install cmd={run => `${run} uix-ui@latest theme beetroot-harrow`} />
        <Code lang="sh" file="Output" code={`  wrote   src/styles/uix.css\n  fonts   Familjen Grotesk, Rubik, JetBrains Mono → index.html`} />
      </section>
      <section>
        <H2 id="list">list</H2>
        <p>Prints every component and every theme in the registry, each with a count.</p>
        <Install cmd={run => `${run} uix-ui@latest list`} />
      </section>
      <section>
        <H2 id="flags">Flags</H2>
        <Table label="CLI flags" head={["Flag", "Used by", "What it does"]} rows={FLAGS} />
      </section>
      <section>
        <H2 id="pro-items">Pro items</H2>
        <Callout tone="pro">
          <b>UIX Pro.</b> Set <code>UIX_LICENSE</code> to your key, then add Pro items by name, the same as free ones: the marketing blocks (<code>hero</code>, <code>pricing-card</code>, <code>testimonial</code>…), the visual styles (<code>skins</code>) and the 210 Pro themes (<code>npx uix-ui theme acid-prompt</code>). <code>list</code> shows them all. Get a key on the <a href="https://uixdesign.pagestro.com/pricing">pricing page</a>.
        </Callout>
      </section>
      <section>
        <H2 id="shadcn">The shadcn CLI</H2>
        <p>The registry uses the shadcn format, and <code>init</code> adds it to <code>components.json</code>. So the shadcn CLI can install uix-ui items too.</p>
        <Install cmd={run => `${run} shadcn@latest add @uix/button`} />
      </section>
      <section>
        <H2 id="messages">Messages</H2>
        <p>Errors start with <code>uix-ui:</code> and the CLI exits with code 1. These are the ones you are most likely to see.</p>
        <Table label="Common messages" head={["Message", "What to do"]} rows={MESSAGES} />
      </section>
    </>
  );
}

const page: DocPage = {
  slug: "cli", title: "CLI",
  lead: "Four commands: init, add, theme and list. Here is what each one does and prints.",
  toc: [
    { id: "overview", label: "Overview" }, { id: "init", label: "init" }, { id: "add", label: "add" }, { id: "add-names", label: "Names", depth: 3 }, { id: "theme", label: "theme" },
    { id: "list", label: "list" }, { id: "flags", label: "Flags" }, { id: "pro-items", label: "Pro items" }, { id: "shadcn", label: "The shadcn CLI" }, { id: "messages", label: "Messages" },
  ],
  Body,
};
export default page;
