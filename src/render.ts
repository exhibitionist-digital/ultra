import type { ReactElement } from "react";
import type { RenderOptions } from "./types.ts";
import { createElement } from "react";
import { LinkHeader } from "./links.ts";
import { SsrDataProvider } from "./react/useSsrData.ts";
import { StreamProvider } from "./react/useStream.ts";
import { renderToStream } from "./stream.ts";

export async function render(
  element: ReactElement,
  options: RenderOptions,
) {
  const {
    strategy = "stream",
    bootstrapModules,
  } = options;

  element = createElement(SsrDataProvider, null, element);

  // deno-lint-ignore prefer-const
  let injectToStream: (chunk: string) => void;

  element = createElement(
    StreamProvider,
    { value: { injectToStream: (chunk: string) => injectToStream(chunk) } },
    element,
  );

  const stream = await renderToStream(element, {
    bootstrapModules,
    disable: strategy === "static",
  });

  injectToStream = stream.injectToStream;

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

  return new Response(stream.readable, {
    status: 200,
    headers,
  });
}
