import { ULTRA_COMPILER_PATH } from "../constants.ts";
import { fromFileUrl, join } from "../deps.ts";

export function toUltraUrl(root: string, path: string) {
  return join(
    ULTRA_COMPILER_PATH,
    fromFileUrl(path.replace(root, "")),
  );
}
