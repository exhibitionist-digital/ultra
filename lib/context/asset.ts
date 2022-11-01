import type { ReactNode } from "react";
import { createElement as h } from "react";
import AssetContext from "../../hooks/asset-context.js";
import useServerInsertedHTML from "../../hooks/use-server-inserted-html.js";

export function AssetProvider(
  { children, value }: {
    children: ReactNode;
    value: Map<string, string> | undefined;
  },
) {
  useServerInsertedHTML(() => {
    /**
     * We don't need to inject if we don't have an assetManifest
     */
    if (!value) {
      return;
    }

    const entries = Array.from(value.entries());

    if (!entries.length) {
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
