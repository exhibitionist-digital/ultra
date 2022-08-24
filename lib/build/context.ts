import { ResolvedPaths } from "./resolvePaths.ts";
import { BuildContext } from "./types.ts";

export function createBuildContext(paths: ResolvedPaths): BuildContext {
  return {
    paths,
    files: new Map(),
  };
}
