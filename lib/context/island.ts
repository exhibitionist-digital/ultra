import type { ComponentType, ReactNode } from "react";
import { createElement as h, Fragment } from "react";
import IslandContext from "../../hooks/island-context.js";
import useServerInsertedHTML from "../../hooks/use-server-inserted-html.js";
import { outdent } from "../deps.ts";

type IslandHydrationData = Record<number, {
  props: Record<string, unknown>;
  name: string;
}>;

type IslandComponent = ComponentType & { url: string };

export function IslandProvider({ children, baseUrl }: {
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

  useServerInsertedHTML(() => {
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
