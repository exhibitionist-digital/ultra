import { createContext, useContext, useMemo } from "react";

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
