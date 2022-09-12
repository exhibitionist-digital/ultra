import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import { createElement as h, Fragment, useCallback } from "react";
import { renderToString } from "react-dom/server";
import AssetContext from "../hooks/asset-context.js";
import FlushEffectsContext from "../hooks/flush-effect-context.js";
import IslandContext from "../hooks/island-context.js";
import ServerContext from "../hooks/server-context.js";
import useFlushEffects from "../hooks/use-flush-effects.js";
import { outdent } from "./deps.ts";
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
          __html: `globalThis.__ULTRA_ASSET_MAP = ${
            JSON.stringify(Array.from(value.entries()))
          }`,
        },
      })
    );
  });

  return h(AssetContext.Provider, { value }, children);
}

type IslandHydrationData = Record<number, {
  props: Record<string, unknown>;
  name: string;
}>;

type IslandComponent = ComponentType & { url: string };

function IslandProvider({ children, baseUrl }: {
  children: ReactNode;
  baseUrl: string;
}) {
  let id = 0;
  let injectHydrator = false;
  let hydratorInjected = false;

  const hydrationData: IslandHydrationData = {};
  const componentPaths: Record<string, string> = {};

  function prepareData(data: IslandHydrationData | Record<string, string>) {
    return JSON.stringify(Object.entries(data));
  }

  useFlushEffects(() => {
    if (!hydratorInjected && injectHydrator) {
      hydratorInjected = true;

      return h(Fragment, null, [
        h("script", {
          key: "island-hydrator-data",
          dangerouslySetInnerHTML: {
            __html: outdent`
            globalThis.__ULTRA_ISLAND_URL = "${baseUrl}";
            globalThis.__ULTRA_ISLAND_DATA = ${prepareData(hydrationData)};
            globalThis.__ULTRA_ISLAND_COMPONENT = ${
              prepareData(componentPaths)
            };`,
          },
        }),
        h("script", {
          type: "module",
          defer: true,
          key: "island-hydrator-script",
          dangerouslySetInnerHTML: {
            __html: `
              import { hydrateIslands } from 'ultra/hooks/island-hydrator.js';
              hydrateIslands();
            `,
          },
        }),
      ]);
    }
  });

  function add(Component: IslandComponent, props: Record<string, unknown>) {
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
  baseUrl: string;
  assetManifest: Map<string, string> | undefined;
};

export function UltraProvider(
  { context, assetManifest, children, baseUrl }: PropsWithChildren<
    UltraProviderProps
  >,
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
            baseUrl,
          }),
        }),
      ),
    },
  );
}
