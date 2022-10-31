import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { UltraProvider } from "./provider.ts";
import { getServerInsertedHTML } from "./context/serverInsertedHtml.ts";
import { createFlushDataStreamHandler } from "./context/dataStream.ts";
import type { Context } from "./types.ts";
import { log } from "./logger.ts";
import {
  continueFromInitialStream,
  renderToInitialStream,
  streamToString,
} from "./stream.ts";
import { ImportMap } from "./types.ts";

type RenderToStreamOptions = ReactDOMServer.RenderToReadableStreamOptions & {
  baseUrl: string;
  importMap: ImportMap | undefined;
  assetManifest: Map<string, string> | undefined;
  enableEsModuleShims?: boolean;
  esModuleShimsPath?: string;
  generateStaticHTML?: boolean;
  serverInsertedHTMLToHead?: boolean;
  disableHydration?: boolean;
};

log.debug(`react: ${React.version} ${import.meta.resolve("react")}`);
log.debug(
  `react-dom/server: ${ReactDOMServer.version} ${
    import.meta.resolve("react-dom/server")
  }`,
);

export async function renderToString(element: React.ReactElement) {
  const renderStream = await ReactDOMServer.renderToReadableStream(element);
  await renderStream.allReady;

  return streamToString(renderStream);
}

export async function renderToStream(
  App: JSX.Element,
  context: Context | undefined,
  options: RenderToStreamOptions,
) {
  const {
    baseUrl,
    generateStaticHTML = false,
    disableHydration = false,
    serverInsertedHTMLToHead = true,
    importMap,
    enableEsModuleShims,
    esModuleShimsPath,
    assetManifest,
  } = options;

  options.bootstrapModules = disableHydration
    ? undefined
    : options.bootstrapModules;

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
    disableHydration,
    getServerInsertedHTML,
    serverInsertedHTMLToHead,
    flushDataStreamHandler,
    dataStream,
    importMap,
    enableEsModuleShims,
    esModuleShimsPath,
  });
}
