import { resolve, toFileUrl } from "../deps.ts";
import { Mode } from "../types.ts";

export function resolveImportMapPath(mode: Mode, root: string, path: string) {
  if (mode === "development") {
    return path;
  }

  return toFileUrl(resolve(root, "importMap.browser.json")).href;
}
