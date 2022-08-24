import type { ResolvedPaths } from "./resolvePaths.ts";
import type { BuildContext } from "./types.ts";

export function createBuildContext(paths: ResolvedPaths): BuildContext {
  return {
    paths,
    files: new Map(),
  };
}
