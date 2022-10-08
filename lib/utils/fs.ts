import { fromFileUrl, relative } from "../deps.ts";

export function makeRelative(root: string, path: string) {
  return `./${
    relative(
      root,
      fromFileUrl(path),
    )
  }`;
}
