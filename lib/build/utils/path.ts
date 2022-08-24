import { extname } from "../../deps.ts";

export function addFileContentHash(path: string, hash: string) {
  const extension = extname(path);
  path = path.replace(extension, `.${hash}${extension}`);

  return path;
}
