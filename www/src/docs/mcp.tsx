import * as React from "react";
import { Link } from "../router";
import { Callout, Code, H2 } from "../site/Docs";
import { MCP_URL, SITE, Tabs, type DocPage } from "./shared";

const AGENTS = [{ id: "claude", name: "Claude Code" }, { id: "cursor", name: "Cursor" }, { id: "vscode", name: "VS Code" }, { id: "shadcn", name: "shadcn MCP" }] as const;
type Agent = (typeof AGENTS)[number]["id"];

const SETUP: Record<Agent, { file: string; lang: "sh" | "json"; code: string; note: React.ReactNode }> = {
  claude: { file: "Terminal", lang: "sh", code: `claude mcp add --transport http uix ${MCP_URL}\n\n# then ask:\n> Build a settings page with uix-ui components\n  and the lagoon-stretch theme.`, note: "Run this once in your terminal." },
  cursor: { file: ".cursor/mcp.json", lang: "json", code: `{\n  "mcpServers": {\n    "uix": { "url": "${MCP_URL}" }\n  }\n}`, note: "Add the server to this file in your project." },
  vscode: { file: ".vscode/mcp.json", lang: "json", code: `{\n  "servers": {\n    "uix": { "type": "http", "url": "${MCP_URL}" }\n  }\n}`, note: "Add the server to this file in your project." },
  shadcn: { file: "Terminal", lang: "sh", code: `npx shadcn@latest mcp init --client claude\n\n# components.json already lists the @uix registry,\n# so the agent can search and add @uix/* items.`, note: <>Uses the shadcn MCP server instead of ours. It works because <code>uix-ui init</code> adds the <code>@uix</code> registry to <code>components.json</code>.</> },
};

function Connect() {
  const [a, setA] = React.useState<Agent>("claude");
  const s = SETUP[a];
  return (
    <Tabs label="Agent" items={AGENTS} value={a} onChange={setA}>
      <p className="dp-note">{s.note}</p>
      <Code lang={s.lang} file={s.file} code={s.code} />
    </Tabs>
  );
}

function Body() {
  return (
    <>
      <section>
        <H2 id="why">Why connect an AI agent</H2>
        <p>An agent that has no design system picks colours and sizes on the spot. The next screen gets slightly different ones, and dark mode is left to chance. With uix-ui it uses your components and your tokens, so every screen matches.</p>
        <div className="dp-pair">
          <div><small>Without a system</small><Code lang="tsx" code={`<button className="bg-[#2563eb] rounded-[7px]\n  px-[14px] py-[9px] text-white">\n  Save\n</button>`} /></div>
          <div><small>With uix-ui</small><Code lang="tsx" code={`<Button>Save</Button>\n<Button variant="outline">Cancel</Button>\n<Badge color="success">Paid</Badge>`} /></div>
        </div>
      </section>
      <section>
        <H2 id="connect">Connect your editor</H2>
        <p>The UIX MCP server lives at <code>{MCP_URL}</code>. Pick your tool.</p>
        <Connect />
      </section>
      <section>
        <H2 id="what-it-does">What the server can do</H2>
        <p>Right now it searches the themes and reads their tokens from inside your editor. Looking up components is the next thing planned.</p>
        <p>Components themselves still come from the <Link to="/docs/cli">CLI</Link> or the registry below.</p>
      </section>
      <section>
        <H2 id="registry">The shadcn registry</H2>
        <p>uix-ui uses the shadcn registry format, so the shadcn CLI can install uix-ui items directly.</p>
        <Code lang="sh" code={`npx shadcn add @uix/button`} />
        <p>The default registry is <code>{SITE}/ui/r</code>. You can read an item as JSON at <code>{SITE}/ui/r/button.json</code>.</p>
      </section>
      <section>
        <H2 id="llms-txt">llms.txt</H2>
        <p><a href={`${SITE}/llms.txt`}>llms.txt</a> is a plain Markdown overview of UIX that AI tools can fetch and quote. It covers what UIX makes, the free and Pro plans, and where to find more.</p>
      </section>
      <section>
        <H2 id="your-own-system">An MCP server for your own system</H2>
        <Callout tone="pro">
          <b>UIX Pro.</b> The UIX Figma plugin can export an MCP server for the design system you build there. It is a single Node file with your tokens, components and rules inside, so Claude Code, Cursor, VS Code and Claude Desktop can ask it which token to use. See <Link to="/docs/figma">the Figma guide</Link>.
        </Callout>
      </section>
    </>
  );
}

const page: DocPage = {
  slug: "mcp", title: "MCP and AI agents",
  lead: "Let Claude Code, Cursor or VS Code build with your components and tokens instead of guessing.",
  toc: [{ id: "why", label: "Why connect an AI agent" }, { id: "connect", label: "Connect your editor" }, { id: "what-it-does", label: "What the server can do" }, { id: "registry", label: "The shadcn registry" }, { id: "llms-txt", label: "llms.txt" }, { id: "your-own-system", label: "An MCP server for your own system" }],
  Body,
};
export default page;
