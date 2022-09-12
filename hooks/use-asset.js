import { useContext, useMemo } from "react";
import AssetContext from "./asset-context.js";

/**
 * This hook returns the resolved path from the generated `asset-manifest.json`
 * It has no effect during development.
 *
 * @param {string} [path]
 */
export default function useAsset(path) {
  if (path === undefined) {
    throw new Error("a path must be supplied");
  }

  // Ensure we are using a relative path
  path = path.startsWith("/") ? `.${path}` : path;

  const context = useContext(AssetContext) ||
    new Map(globalThis.__ULTRA_ASSET_MAP);

  return useMemo(() => context.get(path) || path, [path]);
}
