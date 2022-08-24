import { createContext, createElement as h, useContext, useMemo } from "react";
import { useFlushEffects } from "./flush-effects.js";

/**
 * @type {React.Context<undefined | Map<string, string>>}
 */
const AssetContext = createContext(undefined);

/**
 * @typedef {Object} AssetProviderProps
 * @property {Map<string, string>} value
 * @property {React.ReactNode} [children]
 */

/**
 * @param {AssetProviderProps} props
 */
export function AssetProvider(props) {
  useFlushEffects(() => {
    return h("script", {
      type: "text/javascript",
      dangerouslySetInnerHTML: {
        __html: `window.__ULTRA_ASSET_MAP = ${
          JSON.stringify(Array.from(props.value.entries()))
        }`,
      },
    });
  });

  return h(AssetContext.Provider, { value: props.value }, props.children);
}

/**
 * @param {string} path
 */
export function useAsset(path) {
  const context = useContext(AssetContext) || new Map(window.__ULTRA_ASSET_MAP);
  return useMemo(() => context.get(path) || path, [path]);
}
