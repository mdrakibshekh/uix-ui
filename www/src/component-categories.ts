// Copied from COMPONENT_CATEGORIES in the UIX Figma plugin repo (UIX Design System V1/src/core/components.ts),
// with camelCase ids turned into registry slugs. "Marketing" is left out: those are UIX Pro blocks, not uix-ui components.
export type Category = { id: string; name: string; items: string[] };

export const COMPONENT_CATEGORIES: Category[] = [
  { id: "actions", name: "Actions", items: ["button", "icon-button", "button-group", "link"] },
  { id: "forms", name: "Forms", items: ["input", "select", "textarea", "search-field", "number-input", "otp-input", "combobox", "checkbox", "radio", "switch", "slider", "segmented", "chip", "tag-input", "toggle", "selection-card", "date-picker", "file-upload", "rating"] },
  { id: "navigation", name: "Navigation", items: ["tabs", "breadcrumb", "pagination", "navbar", "sidebar-item", "stepper", "menu", "bottom-nav", "tree-view", "footer"] },
  { id: "feedback", name: "Feedback", items: ["alert", "banner", "toast", "tooltip", "progress", "progress-circle", "spinner", "skeleton", "empty-state", "notification", "cookie-banner"] },
  { id: "data", name: "Data display", items: ["badge", "avatar", "avatar-group", "card", "stat", "list-item", "table", "accordion", "divider", "kbd", "timeline", "description-list", "code-block", "quote", "chart"] },
  { id: "overlays", name: "Overlays", items: ["modal", "popover", "drawer", "sheet", "command-palette"] },
];

export const categoryOf = (slug: string) => COMPONENT_CATEGORIES.find(c => c.items.includes(slug));
