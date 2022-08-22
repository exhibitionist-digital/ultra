import { useCallback } from "react";
import type { ReactElement, ReactNode } from "react";
import {
  RenderToReadableStreamOptions,
  renderToString,
} from "react-dom/server";
import { fromFileUrl } from "./deps.ts";
import { FlushEffectsContext } from "./client/flush-effects.js";
import { continueFromInitialStream, renderToInitialStream } from "./stream.ts";
import { ImportMap } from "./types.ts";

type RenderToStreamOptions = RenderToReadableStreamOptions & {
  importMap: ImportMap;
  generateStaticHTML?: boolean;
  flushEffectsToHead?: boolean;
};

export async function renderToStream(
  Component: ReactElement,
  options: RenderToStreamOptions,
) {
  const {
    generateStaticHTML = false,
    flushEffectsToHead = true,
    importMap,
  } = options;

  /**
   * For each bootstrapModule we convert from a file url (file:///project/client.tsx) to
   * a path string (/project/client.tsx).
   */
  options.bootstrapModules = options?.bootstrapModules?.map(
    (url) => url.startsWith("file://") ? fromFileUrl(url) : url,
  );

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
      <FlushEffectsContext.Provider value={addFlushEffects}>
        {children}
      </FlushEffectsContext.Provider>
    );
  }

  const flushEffectHandler = (): string => {
    return renderToString(
      <>{Array.from(flushEffectsCallbacks).map((callback) => callback())}</>,
    );
  };

  options.onError = (error) => {
    console.error(error);
  };

  const renderStream = await renderToInitialStream({
    element: <FlushEffects children={Component} />,
    options,
  });

  return await continueFromInitialStream(renderStream, {
    generateStaticHTML,
    flushEffectsToHead,
    flushEffectHandler,
    importMap,
  });
}
