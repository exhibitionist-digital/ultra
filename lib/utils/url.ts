import { ULTRA_COMPILER_PATH, ULTRA_STATIC_PATH } from "../constants.ts";
import { fromFileUrl, join } from "../deps.ts";
import { Mode } from "../types.ts";

export function toUltraUrl(root: string, path: string, mode: Mode) {
  return join(
    mode === "development" ? ULTRA_COMPILER_PATH : ULTRA_STATIC_PATH,
    fromFileUrl(path.replace(root, "")),
  );
}
