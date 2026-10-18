# uix-ui

The CLI for [uix-ui](https://uixdesign.pagestro.com/ui): open-source React components and Tailwind CSS v4 themes
that you copy into your project and own. No dependencies.

Needs React 18 or 19, Tailwind CSS v4 and Node 18+. Run in your app's folder:

```bash
npx uix-ui@latest init --preset lagoon-stretch   # theme, cn() helper, components.json
npx uix-ui@latest add button card input          # copy components into src/components/ui
npx uix-ui@latest theme beetroot-harrow          # switch theme
npx uix-ui@latest list                           # all components and themes
```

```tsx
import { Button } from "@/components/ui/button";
```

Dark mode: `<html data-theme="dark">`. Options: `--overwrite` (add), `--no-install` (print the install command
instead of running it), `--registry <url|folder>` (init).

Docs, live components and all 42 themes: https://uixdesign.pagestro.com/ui · Source: https://github.com/mdrakibshekh/uix-ui · MIT
