import * as React from "react";
import { Link } from "../router";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Callout, Code, H2, H3, Preview, type PmId } from "../site/Docs";
import { Install, Table, Tabs, type DocPage } from "./shared";

type Fw = "next" | "vite" | "astro" | "react";
const FRAMEWORKS = [{ id: "next", name: "Next.js" }, { id: "vite", name: "Vite" }, { id: "astro", name: "Astro" }, { id: "react", name: "Existing app" }] as const;

const CREATE: Record<Fw, { note: string; cmd?: Record<PmId, string>; tw?: Record<PmId, string> }> = {
  next: { note: "Say yes to Tailwind CSS when it asks.", cmd: { npm: "npx create-next-app@latest my-app", pnpm: "pnpm create next-app my-app", yarn: "yarn create next-app my-app", bun: "bun create next-app my-app" } },
  vite: { note: "Then add Tailwind CSS v4 with its Vite plugin.", cmd: { npm: "npm create vite@latest my-app -- --template react-ts", pnpm: "pnpm create vite my-app --template react-ts", yarn: "yarn create vite my-app --template react-ts", bun: "bun create vite my-app --template react-ts" }, tw: { npm: "npm install tailwindcss @tailwindcss/vite", pnpm: "pnpm add tailwindcss @tailwindcss/vite", yarn: "yarn add tailwindcss @tailwindcss/vite", bun: "bun add tailwindcss @tailwindcss/vite" } },
  astro: { note: "Then add React and Tailwind with astro add.", cmd: { npm: "npm create astro@latest my-app", pnpm: "pnpm create astro@latest my-app", yarn: "yarn create astro my-app", bun: "bun create astro my-app" }, tw: { npm: "npx astro add react tailwind", pnpm: "pnpm astro add react tailwind", yarn: "yarn astro add react tailwind", bun: "bunx astro add react tailwind" } },
  react: { note: "Already have React and Tailwind CSS v4? Skip to the next step." },
};

function CreateApp() {
  const [fw, setFw] = React.useState<Fw>("next");
  const c = CREATE[fw];
  return (
    <Tabs label="Framework" items={FRAMEWORKS} value={fw} onChange={setFw}>
      <p className="dp-note">{c.note}</p>
      {c.cmd && <Install cmd={(_, pm) => c.cmd![pm]} />}
      {c.tw && <><p className="dp-note">Tailwind CSS v4:</p><Install cmd={(_, pm) => c.tw![pm]} /></>}
      {fw === "vite" && <p className="dp-note">The Tailwind CSS docs show how to register the plugin: <a href="https://tailwindcss.com/docs/installation">tailwindcss.com/docs/installation</a>.</p>}
      {fw === "react" && <p className="dp-note">Run the commands below from the folder that holds your <code>package.json</code>.</p>}
    </Tabs>
  );
}

const WRITES: React.ReactNode[][] = [
  [<code key="a">components.json</code>, "Adds the @uix and @uix-pro registries. A new file also gets the usual shadcn-style aliases.", "An existing file is kept; only the registries are added."],
  [<code key="b">src/styles/uix.css</code>, "The theme: colours in light and dark, type scale, spacing, radius, shadows.", "Rewritten by init and by theme. Put your own changes in your own CSS."],
  [<>Your main CSS file</>, <>An <code>@import</code> of the theme, right after <code>@import &quot;tailwindcss&quot;</code>.</>, <>The first of src/index.css, src/app/globals.css, app/globals.css, src/styles/globals.css, src/main.css that exists. If none does, src/index.css is created.</>],
  [<code key="c">src/lib/utils.ts</code>, <>The <code>cn()</code> helper.</>, "Not overwritten if it already exists."],
  [<code key="d">index.html</code>, <>Google Fonts links for the theme, between <code>{"<!-- uix-fonts -->"}</code> markers.</>, "Only when an index.html exists (Vite). Other setups get the links printed."],
  [<>Dependencies</>, <>clsx and tailwind-merge, if missing.</>, "Installed with the package manager your lockfile points to. Pass --no-install to only print the command."],
];

const STOPS: React.ReactNode[][] = [
  [<code key="a">no components.json here</code>, <>You ran <code>add</code> or <code>theme</code> before <code>init</code>.</>, <>Run <code>uix-ui init</code> first.</>],
  [<code key="b">UIX themes need Tailwind CSS v4 (found v3)</code>, "Your package.json lists Tailwind CSS 3.", "Upgrade to Tailwind CSS v4, then run init again."],
  [<code key="c">run this in your app folder</code>, "There is no package.json in the current folder.", "cd into your app and run the command again."],
];

function Body() {
  return (
    <>
      <section>
        <H2 id="requirements">Requirements</H2>
        <ul>
          <li>React 18 or 19.</li>
          <li>Tailwind CSS v4. The CLI stops if it finds v3.</li>
          <li>Node 18 or newer to run the CLI. It has no dependencies of its own.</li>
        </ul>
      </section>
      <section>
        <H2 id="create-your-app">Create your app</H2>
        <p>Pick your framework. If you already have an app, you can skip this step.</p>
        <CreateApp />
      </section>
      <section>
        <H2 id="set-up-the-theme">Set up the theme</H2>
        <p>Run <code>init</code> in your app folder. Choose a theme with <code>--preset</code>; browse them on the <Link to="/themes">themes page</Link>. Leave the flag out for the UIX default.</p>
        <Install cmd={run => `${run} uix-ui@latest init --preset lagoon-stretch`} />
        <Code lang="sh" file="Output" code={`  wrote   components.json\n  wrote   src/styles/uix.css\n  fonts   Sora, Plus Jakarta Sans, JetBrains Mono → index.html\n  updated src/index.css\n  wrote   src/lib/utils.ts\n\nDone. Next: npx uix-ui add button card input\nDark mode: <html data-theme="dark">. Other presets: npx uix-ui theme <preset>.`} />
        <H3 id="what-init-writes">What init writes</H3>
        <Table label="Files init writes" head={["Where", "What", "Good to know"]} rows={WRITES} />
        <p>If your project has a <code>src</code> folder, files go in it. Otherwise they go in the project root.</p>
      </section>
      <section>
        <H2 id="add-components">Add components</H2>
        <p>Name the components you need. Anything they depend on comes along, and missing packages are installed for you.</p>
        <Install cmd={run => `${run} uix-ui@latest add button badge`} />
        <Code lang="sh" file="Output" code={`  wrote   src/components/ui/button.tsx\n  wrote   src/components/ui/icons.tsx\n  wrote   src/components/ui/badge.tsx\n\nnpm install class-variance-authority`} />
        <p>Components import each other with relative paths, so you do not need an <code>@/</code> alias in your tsconfig. Add <code>--overwrite</code> to replace files that already exist.</p>
      </section>
      <section>
        <H2 id="use-a-component">Use a component</H2>
        <p>Import it from the folder it was copied to and use it like any other React component.</p>
        <Preview code={`import { Badge } from "./components/ui/badge";\nimport { Button } from "./components/ui/button";\n\nexport default function App() {\n  return (\n    <>\n      <Button>Save</Button>\n      <Button variant="outline">Cancel</Button>\n      <Badge color="success">Paid</Badge>\n    </>\n  );\n}`}>
          <Button>Save</Button>
          <Button variant="outline">Cancel</Button>
          <Badge color="success">Paid</Badge>
        </Preview>
        <Callout>Interactive components are marked <code>&quot;use client&quot;</code>, so they work in Next.js with Server Components.</Callout>
      </section>
      <section>
        <H2 id="if-it-stops">If a command stops</H2>
        <Table label="Common messages" head={["Message", "Why", "Fix"]} rows={STOPS} />
        <p>Next: <Link to="/docs/theming">theming</Link>, or the <Link to="/docs/cli">full list of commands</Link>.</p>
      </section>
    </>
  );
}

const page: DocPage = {
  slug: "installation", title: "Installation",
  lead: "Create an app, run init, add the components you want. It takes about a minute.",
  toc: [
    { id: "requirements", label: "Requirements" }, { id: "create-your-app", label: "Create your app" }, { id: "set-up-the-theme", label: "Set up the theme" },
    { id: "what-init-writes", label: "What init writes", depth: 3 }, { id: "add-components", label: "Add components" }, { id: "use-a-component", label: "Use a component" }, { id: "if-it-stops", label: "If a command stops" },
  ],
  Body,
};
export default page;
