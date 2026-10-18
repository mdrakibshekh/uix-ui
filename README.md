# uix-ui

Open-source React components and Tailwind CSS v4 themes that start in your brand. You copy the components into
your project and own the code, the way shadcn/ui works. Made by the same generator as the
[UIX Figma plugin](https://uixdesign.pagestro.com/), so the code and the Figma library use the same names and tokens.

- 64 accessible components (forms, navigation, feedback, data display, overlays)
- 42 themes, each with light and dark colours, fonts, radius and shadows
- One CLI with no dependencies; works with the shadcn CLI too
- MIT licensed

Docs, live components and every theme: **https://uixdesign.pagestro.com/ui**

## Requirements

- React 18 or 19
- Tailwind CSS v4 (the CLI stops if it finds v3)
- Node 18 or newer

## Quick start

In an existing React + Tailwind v4 app (Vite, Next.js, Astro, Remix…), run these in the project folder:

```bash
npx uix-ui@latest init --preset lagoon-stretch   # theme, cn() helper and components.json
npx uix-ui@latest add button card input          # copy components into src/components/ui
```

Then use them like any other component:

```tsx
import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button>Save</Button>;
}
```

Leave out `--preset` to start with the UIX default theme. Don't have an app yet? Create one first:

```bash
npx create-next-app@latest my-app --tailwind      # Next.js
npm create vite@latest my-app -- --template react-ts   # Vite, then add Tailwind v4: https://tailwindcss.com/docs/installation
```

### What `init` changes

| File | What happens |
|---|---|
| `components.json` | Created, or the `@uix` registry is added to yours |
| `src/styles/uix.css` | The theme: colours for light and dark, type scale, spacing, radius, shadows |
| Your main CSS file | `@import "./styles/uix.css";` is added after `@import "tailwindcss";` (it finds `src/index.css`, `src/app/globals.css`, `app/globals.css`, Astro's `src/styles/global.css` and React Router's `app/app.css`) |
| `src/lib/utils.ts` | The `cn()` helper, if you don't have one |
| `index.html` | Google Fonts links for the theme (Vite). Next.js and others get the links printed to add yourself |
| `package.json` | `clsx` and `tailwind-merge` installed if missing (`--no-install` only prints the command) |

Without a `src` folder, files go in the project root instead.

## Commands

```bash
npx uix-ui@latest init [--preset <id>]       # set up the theme and config
npx uix-ui@latest add <component...>         # copy components (and what they depend on)
npx uix-ui@latest theme <id>                 # switch to another theme; components don't change
npx uix-ui@latest list                       # every component and theme
```

`add` keeps files you already have; pass `--overwrite` to replace them.

## Themes

Browse all 42 at https://uixdesign.pagestro.com/ui/themes and switch any time with `npx uix-ui theme <id>`.
Every colour, font and radius is a CSS variable, so you can change any token in your own CSS after the import.

Prefer to keep the theme out of your source? Install the same themes from npm:

```bash
npm i @uix-ui/tailwind
```

```css
@import "tailwindcss";
@import "@uix-ui/tailwind/themes/lagoon-stretch.css";
```

## Dark mode

Every theme has dark colours. Set `data-theme="dark"` on `<html>` (or add a `dark` class) and the same tokens
switch. No component changes.

## With the shadcn CLI

After `init`, `components.json` has the `@uix` registry, so shadcn works too. shadcn needs the `@/*` import alias
in `tsconfig.json` (Next.js has it; add it in Vite); the uix-ui CLI doesn't.

```bash
npx shadcn@latest add @uix/button
npx shadcn@latest add https://uixdesign.pagestro.com/ui/r/button.json   # works without init as well
```

## AI agents (MCP)

Point Claude Code, Cursor or VS Code at the UIX MCP server, `https://uixdesign.pagestro.com/mcp`, so your agent can
search the themes and read their tokens. Setup for each editor: https://uixdesign.pagestro.com/ui/docs/mcp

## UIX Pro

Everything in this repository is free and MIT. [UIX Pro](https://uixdesign.pagestro.com/pricing) adds, with the
same CLI: 10 marketing blocks (hero, pricing card, testimonial, CTA…), nine visual styles (glass, clay, neon,
brutalism…) and 210 more themes. Set your key and add them by name:

```bash
export UIX_LICENSE=<your key>
npx uix-ui@latest add hero pricing-card
npx uix-ui@latest add skins                  # visual styles, then <html data-skin="glass">
npx uix-ui@latest theme acid-prompt          # a Pro theme
npx uix-ui@latest list                       # shows the Pro items too
```

Monthly or yearly, or a one-time lifetime license for one project or unlimited projects: email
support@uixdesign.pagestro.com.

## This repository

| Path | What |
|---|---|
| `registry/` | The registry the CLI and shadcn read: `registry.json` and `r/<name>.json` for every component and theme |
| `packages/cli` | The `uix-ui` CLI (npm: `uix-ui`) |
| `packages/tailwind` | The themes as CSS (npm: `@uix-ui/tailwind`) |
| `www/` | The docs site at uixdesign.pagestro.com/ui (Vite + React, pre-rendered) |
| `scripts/build.mts` | Generates `registry/` and the themes from the UIX engine |

The components and themes are generated, not written by hand, so fixes land in the generator. Found a bug or want
a component? [Open an issue](https://github.com/mdrakibshekh/uix-ui/issues).

Run the docs site locally:

```bash
npm --prefix www install
npm --prefix www run dev
```

## License

MIT © Pagestro. Icons in the components are Lucide shapes (ISC). See `LICENSE` and `LICENSE-THIRD-PARTY`.
