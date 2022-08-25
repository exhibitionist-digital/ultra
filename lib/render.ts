import type { ReactNode } from "react";
import { createElement as h, Fragment, useCallback } from "react";
import {
  RenderToReadableStreamOptions,
  renderToString,
} from "react-dom/server";
import AssetContext from "../hooks/asset-context.js";
import FlushEffectsContext from "../hooks/flush-effect-context.js";
import useFlushEffects from "../hooks/use-flush-effects.js";
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

const flushEffectsCallbacks: Set<() => ReactNode> = new Set();

function FlushEffects({ children }: { children: JSX.Element }) {
  // Reset flushEffectsHandler on each render
  flushEffectsCallbacks.clear();

  const addFlushEffects = useCallback(
    (handler: () => ReactNode) => {
      flushEffectsCallbacks.add(handler);
    },
    [],
  );

  return (
    h(FlushEffectsContext.Provider, { value: addFlushEffects }, children)
  );
}

const flushEffectHandler = (): string => {
  return renderToString(
    h(
      Fragment,
      null,
      Array.from(flushEffectsCallbacks).map((callback) => callback()),
    ),
  );
};

function AssetProvider(
  { children, value }: { children: JSX.Element; value: Map<string, string> },
) {
  useFlushEffects(() => {
    return (
      h("script", {
        type: "text/javascript",
        dangerouslySetInnerHTML: {
          __html: `window.__ULTRA_ASSET_MAP = ${
            JSON.stringify(Array.from(value.entries()))
          }`,
        },
      })
    );
  });

  return h(AssetContext.Provider, { value }, children);
}

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
      FlushEffects,
      null,
      h(AssetProvider, { value: assetManifest, children: App }),
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
