import { usePreset } from "../lib";
import { Link } from "../router";
import { Button } from "../components/ui/button";
import { Callout, Code, H2, Preview } from "../site/Docs";
import type { DocPage } from "./shared";

/** The live toggle uses the same switch the site header uses, so the whole page changes. */
function Toggle() {
  const { mode, setMode } = usePreset();
  return (
    <div className="dp-toggle">
      <Button variant="outline" onClick={() => setMode(mode === "dark" ? "light" : "dark")}>{mode === "dark" ? "Switch to light" : "Switch to dark"}</Button>
      <span>The <code>html</code> element now has <code>{`data-theme="${mode}"`}</code>.</span>
    </div>
  );
}

const TOGGLE = `import { useEffect, useState } from "react";\nimport { Button } from "./components/ui/button";\n\nexport function ThemeToggle() {\n  const [mode, setMode] = useState("light");\n  useEffect(() => {\n    setMode(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");\n  }, []);\n\n  function toggle() {\n    const next = mode === "dark" ? "light" : "dark";\n    document.documentElement.setAttribute("data-theme", next);\n    localStorage.setItem("mode", next);\n    setMode(next);\n  }\n\n  return (\n    <Button variant="outline" onClick={toggle}>\n      {mode === "dark" ? "Switch to light" : "Switch to dark"}\n    </Button>\n  );\n}`;

const NO_FLASH = `<script>\n  var mode = localStorage.getItem("mode");\n  if (!mode) mode = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";\n  document.documentElement.setAttribute("data-theme", mode);\n</script>`;

function Body() {
  return (
    <>
      <section>
        <H2 id="how-it-works">How it works</H2>
        <p>Set <code>data-theme=&quot;dark&quot;</code> on the <code>html</code> element. Every colour token switches to its dark value and the components follow, including their animations.</p>
        <Code lang="tsx" file="index.html" code={`<html lang="en" data-theme="dark">`} />
        <p>Every theme ships both sets of tokens in the same file, so there is nothing extra to install. A <code>dark</code> class on <code>html</code> works too.</p>
      </section>
      <section>
        <H2 id="add-a-toggle">Add a toggle</H2>
        <p>The theme only reads the attribute. Remembering the choice is up to your app. This button saves it in <code>localStorage</code>.</p>
        <Code lang="tsx" file="src/theme-toggle.tsx" code={TOGGLE} />
      </section>
      <section>
        <H2 id="follow-the-system">Follow the system setting</H2>
        <p>Put a small script in the <code>head</code> of your page. It uses the saved choice, or the visitor&apos;s system setting when nothing is saved, and runs before the first paint so the page never flashes the wrong colours.</p>
        <Code lang="tsx" file="index.html" code={NO_FLASH} />
      </section>
      <section>
        <H2 id="try-it">Try it</H2>
        <p>This changes the whole site, not only the box.</p>
        <Preview code={TOGGLE}>
          <Toggle />
        </Preview>
      </section>
      <section>
        <H2 id="dark-styles-in-your-code">Dark styles in your own code</H2>
        <p>Use the semantic classes, such as <code>bg-surface</code> and <code>text-fg-primary</code>. They change by themselves, so most of your code needs no dark rules.</p>
        <p>When you do need one, the Tailwind <code>dark:</code> variant is wired to the same attribute.</p>
        <Code lang="tsx" code={`<div className="bg-surface dark:bg-subtle">…</div>`} />
        <Callout>The list of tokens and what they map to is on the <Link to="/docs/theming">theming page</Link>.</Callout>
      </section>
    </>
  );
}

const page: DocPage = {
  slug: "dark-mode", title: "Dark mode",
  lead: "One attribute on the html element switches every theme between light and dark.",
  toc: [{ id: "how-it-works", label: "How it works" }, { id: "add-a-toggle", label: "Add a toggle" }, { id: "follow-the-system", label: "Follow the system setting" }, { id: "try-it", label: "Try it" }, { id: "dark-styles-in-your-code", label: "Dark styles in your own code" }],
  Body,
};
export default page;
