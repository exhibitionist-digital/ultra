import type { ReactElement } from "react";
import type { RenderOptions } from "./types.ts";
import { renderToReadableStream } from "react-dom/server";
import { LinkHeader } from "./links.ts";

export async function render(
  element: ReactElement,
  options: RenderOptions,
) {
  const {
    strategy = "stream",
    bootstrapModules,
  } = options;

  const stream = await renderToReadableStream(element, {
    bootstrapModules,
  });

  if (strategy === "static") {
    await stream.allReady;
  }

  const links = new LinkHeader();

  for (const preload of bootstrapModules) {
    if (preload.includes("//esm.sh") || preload.endsWith(".js")) {
      links.preloadModule(preload);
    }
  }

  const headers = new Headers({
    "content-type": "text/html; charset=utf-8",
    "link": links.toString(),
  });

  return new Response(stream, {
    status: 200,
    headers,
  });
}
