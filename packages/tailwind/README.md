# @uix-ui/tailwind

The [uix-ui](https://uixdesign.pagestro.com/ui) themes as Tailwind CSS v4 CSS: colours for light and dark, type
scale, spacing, radius and shadows as CSS variables. 42 themes, one file each.

```bash
npm i @uix-ui/tailwind
```

```css
@import "tailwindcss";
@import "@uix-ui/tailwind/themes/lagoon-stretch.css";   /* or "@uix-ui/tailwind" for the UIX default */
```

Dark mode: `<html data-theme="dark">` or a `dark` class. Browse every theme: https://uixdesign.pagestro.com/ui/themes

The components that use these tokens are added with the CLI: `npx uix-ui@latest add button`.
Source: https://github.com/mdrakibshekh/uix-ui · MIT
