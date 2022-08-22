import { toFileUrl } from "./deps.ts";
import { ResolvedPaths } from "./resolvePaths.ts";

/**
 * Creates a code only ModuleGraph
 */
export async function createGraph(paths: ResolvedPaths) {
  const { createGraph: createModuleGraph } = await import(
    "https://deno.land/x/deno_graph@0.31.0/mod.ts"
  );
  return createModuleGraph(toFileUrl(paths.output.browser).href, {
    kind: "codeOnly",
  });
}
