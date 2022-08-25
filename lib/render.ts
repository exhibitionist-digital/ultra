import { createElement as h, Fragment, useCallback } from "react";
import type { ReactNode } from "react";
import {
  RenderToReadableStreamOptions,
  renderToString,
} from "react-dom/server";
import { fromFileUrl } from "./deps.ts";
import {
  FlushEffectsContext,
  useFlushEffects,
} from "./client/flush-effects.js";
import { continueFromInitialStream, renderToInitialStream } from "./stream.ts";
import { ImportMap } from "./types.ts";
import { AssetContext } from "./client/asset.js";

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
    console.error(error);
  };

  const renderStream = await renderToInitialStream({
    element: h(
      FlushEffects,
      null,
      h(AssetProvider, { value: assetManifest, children: App }),
    ),
    options,
  });

  return await continueFromInitialStream(renderStream, {
    generateStaticHTML,
    flushEffectsToHead,
    flushEffectHandler,
    importMap,
  });
}
