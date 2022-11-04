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

  if (path.startsWith("/") === false) {
    throw new Error(
      `The path provided to the useAsset hook must begin with "/" received: ${path}`,
    );
  }

  const context = useContext(AssetContext) ||
    new Map(globalThis.__ULTRA_ASSET_MAP || []);

  return useMemo(() => context.get(path) || path, [path]);
}
