import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge cannot tell that this design system's type styles (text-label-medium…) are font sizes: it would read
// them as text colors and drop one of text-label-medium / text-fg-primary. Registering them keeps both.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display-large","display-medium","heading-1","heading-2","heading-3","heading-4","heading-5","heading-6","title-large","title-medium","title-small","subtitle-large","subtitle-medium","subtitle-small","body-xl","body-large","body-medium","body-small","body-xs","label-large","label-medium","label-small","caption","caption-small","overline","code-large","code","code-small"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
