import { createContext, createElement as h, useContext, useMemo } from "react";
import { useFlushEffects } from "./flush-effects.js";

/**
 * @type {React.Context<undefined | Map<string, string>>}
 */
export const AssetContext = createContext(undefined);

/**
 * @param {string} path
 */
export function useAsset(path) {
  const context = useContext(AssetContext) || new Map(window.__ULTRA_ASSET_MAP);
  return useMemo(() => context.get(path) || path, [path, context]);
}

/**
 * @param {string} href
 * @param {React.LinkHTMLAttributes<HTMLLinkElement>} options
 */
export function usePreload(href, options) {
  useFlushEffects(() => {
    return h("link", {
      rel: "preload",
      href,
      ...options,
    });
  });

  return null;
}
