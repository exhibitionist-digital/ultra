import type { PropsWithChildren } from "react";
import { createElement as h } from "react";
import { AssetProvider } from "./context/asset.ts";
import { DataStreamProvider } from "./context/dataStream.ts";
import { FlushEffectsProvider } from "./context/flushEffects.ts";
import { IslandProvider } from "./context/island.ts";
import { ServerContextProvider } from "./context/server.ts";
import type { Context } from "./types.ts";

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
      context,
      children: h(DataStreamProvider, {
        children: h(
          FlushEffectsProvider,
          null,
          h(AssetProvider, {
            value: assetManifest,
            children: h(IslandProvider, {
              children,
              baseUrl,
            }),
          }),
        ),
      }),
    },
  );
}
