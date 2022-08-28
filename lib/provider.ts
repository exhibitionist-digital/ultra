import type { PropsWithChildren, ReactNode } from "react";
import { createElement as h, Fragment, useCallback } from "react";
import { renderToString } from "react-dom/server";
import AssetContext from "../hooks/asset-context.js";
import FlushEffectsContext from "../hooks/flush-effect-context.js";
import ServerContext from "../hooks/server-context.js";
import useFlushEffects from "../hooks/use-flush-effects.js";
import type { Context } from "./types.ts";

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

export const flushEffectHandler = (): string => {
  return renderToString(
    h(
      Fragment,
      null,
      Array.from(flushEffectsCallbacks).map((callback) => callback()),
    ),
  );
};

function AssetProvider(
  { children, value }: { children: ReactNode; value: Map<string, string> },
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

function ServerContextProvider(
  { children, value }: { children: ReactNode; value: Context | undefined },
) {
  return h(ServerContext.Provider, { value }, children);
}

type UltraProviderProps = {
  context: Context | undefined;
  assetManifest: Map<string, string>;
};

export function UltraProvider(
  { context, assetManifest, children }: PropsWithChildren<UltraProviderProps>,
) {
  return h(
    ServerContextProvider,
    {
      value: context,
      children: h(
        FlushEffects,
        null,
        h(AssetProvider, { value: assetManifest, children }),
      ),
    },
  );
}
