import { type ImportMapJson, resolve, toFileUrl } from "../deps.ts";
import { Mode } from "../types.ts";

export function resolveImportMapPath(mode: Mode, root: string, path: string) {
  if (mode === "development") {
    return path;
  }

  return toFileUrl(resolve(root, "importMap.browser.json")).href;
}

export const readImportMap = async (path: string) => {
  const importMap = await Deno.readTextFile(path);
  // TODO: zod-check the import map
  return JSON.parse(importMap) as ImportMapJson;
}
