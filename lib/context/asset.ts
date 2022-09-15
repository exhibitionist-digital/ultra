import type { ReactNode } from "react";
import { createElement as h } from "react";
import AssetContext from "../../hooks/asset-context.js";
import useFlushEffects from "../../hooks/use-flush-effects.js";

export function AssetProvider(
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
