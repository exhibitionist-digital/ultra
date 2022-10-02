import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { UltraProvider } from "./provider.ts";
import { flushEffectHandler } from "./context/flushEffects.ts";
import { createFlushDataStreamHandler } from "./context/dataStream.ts";
import { fromFileUrl } from "./deps.ts";
import type { Context } from "./types.ts";
import { log } from "./logger.ts";
import { continueFromInitialStream, renderToInitialStream } from "./stream.ts";
import { ImportMap } from "./types.ts";

type RenderToStreamOptions = ReactDOMServer.RenderToReadableStreamOptions & {
  baseUrl: string;
  importMap: ImportMap | undefined;
  assetManifest: Map<string, string> | undefined;
  esModuleShimsPath: string;
  generateStaticHTML?: boolean;
  flushEffectsToHead?: boolean;
  disableHydration?: boolean;
};

log.debug(`react: ${React.version} ${import.meta.resolve("react")}`);
log.debug(
  `react-dom/server: ${ReactDOMServer.version} ${
    import.meta.resolve("react-dom/server")
  }`,
);

export async function renderToStream(
  App: JSX.Element,
  context: Context | undefined,
  options: RenderToStreamOptions,
) {
  const {
    baseUrl,
    generateStaticHTML = false,
    disableHydration = false,
    flushEffectsToHead = true,
    importMap,
    esModuleShimsPath,
    assetManifest,
  } = options;

  /**
   * For each bootstrapModule we convert from a file url (file:///project/client.tsx) to
   * a path string (/project/client.tsx).
   */
  options.bootstrapModules = disableHydration
    ? []
    : options?.bootstrapModules?.map(
      (url) => url.startsWith("file://") ? fromFileUrl(url) : url,
    );

  options.onError = (error) => {
    log.error(error);
  };

  const renderStream = await renderToInitialStream({
    element: React.createElement(
      UltraProvider,
      {
        baseUrl,
        context,
        assetManifest,
        children: App,
      },
    ),
    options,
  });

  const dataStream = new TransformStream<Uint8Array, Uint8Array>();
  const flushDataStreamHandler = createFlushDataStreamHandler(
    dataStream.writable.getWriter(),
  );

  return await continueFromInitialStream(renderStream, {
    generateStaticHTML,
    flushEffectsToHead,
    flushEffectHandler,
    flushDataStreamHandler,
    dataStream,
    importMap,
    esModuleShimsPath,
  });
}
