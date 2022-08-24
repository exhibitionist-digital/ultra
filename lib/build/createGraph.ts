import { BuildContext } from "../../build.ts";
import { toFileUrl } from "./deps.ts";

/**
 * Creates a code only ModuleGraph
 */
export async function createGraph(context: BuildContext) {
  const { createGraph: createModuleGraph } = await import(
    "https://deno.land/x/deno_graph@0.31.0/mod.ts"
  );
  return createModuleGraph(toFileUrl(context.paths.output.browser).href, {
    kind: "codeOnly",
  });
}
