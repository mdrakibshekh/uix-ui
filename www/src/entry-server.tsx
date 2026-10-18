import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { titleOf } from "./routes";

export { allPaths, chunkOf, preloadAll } from "./routes";

/** `url` is a route path such as "/components/button". */
export function render(url: string): { html: string; title: string; description: string } {
  return { html: renderToString(<StrictMode><App url={url} /></StrictMode>), ...titleOf(url.replace(/(.)\/+$/, "$1")) };
}
