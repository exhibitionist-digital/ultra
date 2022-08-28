import { createElement as h } from "react";
import { RenderToReadableStreamOptions } from "react-dom/server";
import { flushEffectHandler, UltraProvider } from "./provider.ts";
import { fromFileUrl, sprintf } from "./deps.ts";
import { log } from "./logger.ts";
import { continueFromInitialStream, renderToInitialStream } from "./stream.ts";
import { ImportMap } from "./types.ts";

type RenderToStreamOptions = RenderToReadableStreamOptions & {
  importMap: ImportMap;
  assetManifest: Map<string, string>;
  generateStaticHTML?: boolean;
  flushEffectsToHead?: boolean;
};

export async function renderToStream(
  App: JSX.Element,
  options: RenderToStreamOptions,
) {
  const {
    generateStaticHTML = false,
    flushEffectsToHead = true,
    importMap,
    assetManifest,
  } = options;

  /**
   * For each bootstrapModule we convert from a file url (file:///project/client.tsx) to
   * a path string (/project/client.tsx).
   */
  options.bootstrapModules = options?.bootstrapModules?.map(
    (url) => url.startsWith("file://") ? fromFileUrl(url) : url,
  );

  options.onError = (error) => {
    log.error(error);
  };

  log.debug(sprintf("Rendering to initial stream"));
  const renderStream = await renderToInitialStream({
    element: h(
      UltraProvider,
      { assetManifest, children: App },
    ),
    options,
  });

  log.debug(sprintf("Continuing from initial stream"));
  return await continueFromInitialStream(renderStream, {
    generateStaticHTML,
    flushEffectsToHead,
    flushEffectHandler,
    importMap,
  });
}
