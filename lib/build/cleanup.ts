import type { ResolvedPaths } from "./resolvePaths.ts";

export async function cleanup(paths: ResolvedPaths) {
  await Deno.remove(paths.resolveOutputFileUrl("importMap.json"));
}
