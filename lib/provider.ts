import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import { createElement as h, Fragment, useCallback } from "react";
import { renderToString } from "react-dom/server";
import AssetContext from "../hooks/asset-context.js";
import FlushEffectsContext from "../hooks/flush-effect-context.js";
import ServerContext from "../hooks/server-context.js";
import IslandContext from "../hooks/island-context.js";
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
  { children, value }: {
    children: ReactNode;
    value: Map<string, string> | undefined;
  },
) {
  useFlushEffects(() => {
    /**
     * We don't need to inject if we don't have an assetManifest
     */
    if (!value) {
      return;
    }

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

function IslandProvider({ children }: {
  children: ReactNode;
}) {
  let id = 0;
  let injectHydrator = false;
  let hydratorInjected = false;

  const hydrationData: Record<number, any> = {};
  const componentPaths: Record<string, string> = {};

  // deno-lint-ignore no-explicit-any
  function prepare(data: any) {
    return JSON.stringify(Object.entries(data));
  }

  useFlushEffects(() => {
    id = 0;

    if (!hydratorInjected && injectHydrator) {
      hydratorInjected = true;

      return [
        h("script", {
          dangerouslySetInnerHTML: {
            __html: `
              window.__ULTRA_ISLAND_DATA = ${prepare(hydrationData)};
              window.__ULTRA_ISLAND_COMPONENT = ${prepare(componentPaths)};
            `,
          },
        }),
        h("script", {
          type: "module",
          defer: true,
          src: import.meta.resolve("ultra/hooks/island-hydrator.js"),
        }),
      ];
    }
  });

  // deno-lint-ignore no-explicit-any
  function add(Component: ComponentType & { url: string }, props: any) {
    const name = Component.displayName ?? Component.name;
    injectHydrator = true;

    hydrationData[id] = {
      props,
      name,
    };

    componentPaths[name] = Component.url.replace("file://", "").replace(
      Deno.cwd(),
      ".",
    );

    return id++;
  }

  return h(IslandContext.Provider, { value: add }, children);
}

function ServerContextProvider(
  { children, value }: { children: ReactNode; value: Context | undefined },
) {
  return h(ServerContext.Provider, { value }, children);
}

type UltraProviderProps = {
  context: Context | undefined;
  assetManifest: Map<string, string> | undefined;
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
        h(AssetProvider, {
          value: assetManifest,
          children: h(IslandProvider, {
            children,
          }),
        }),
      ),
    },
  );
}
