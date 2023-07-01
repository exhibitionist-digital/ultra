import { extname } from "../deps.ts";

export function isCompilerTarget(path: string) {
  const extension = extname(path);
  return [".ts", ".tsx", ".js", ".jsx"].includes(extension);
}
