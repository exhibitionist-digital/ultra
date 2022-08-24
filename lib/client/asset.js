import { createContext, createElement as h, useContext, useMemo } from "react";
import { useFlushEffects } from "./flush-effects.js";

/**
 * @type {React.Context<undefined | Map<string, string>>}
 */
export const AssetContext = createContext(undefined);

/**
 * This hook returns the resolved path from the generated `asset-manifest.json`
 * It has no effect during development.
 *
 * @param {string} path
 */
export function useAsset(path) {
  const context = useContext(AssetContext) || new Map(window.__ULTRA_ASSET_MAP);
  return useMemo(() => context.get(path) || path, [path, context]);
}

/**
 * This hook will insert a `<link rel="preload" />` tag into the head of the
 * server render document. During client side transitions, this won't do anything.
 *
 * @param {string} href
 * @param {React.LinkHTMLAttributes<HTMLLinkElement>} props
 */
export function usePreload(href, props) {
  useFlushEffects(() => {
    return h("link", {
      rel: "preload",
      href,
      ...props,
    });
  });

  return null;
}
