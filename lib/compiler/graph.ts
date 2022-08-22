import type { ModuleJson } from "https://deno.land/x/deno_graph@0.31.0/lib/types.d.ts";
import { createGraph as createModuleGraph } from "https://deno.land/x/deno_graph@0.31.0/mod.ts";

export type ModuleGraph = Map<string, ModuleJson>;

export async function createGraph(specifier: string) {
  const graph = await createModuleGraph(specifier, {
    kind: "codeOnly",
  });

  const moduleGraph: ModuleGraph = new Map();

  for (const module of graph.modules) {
    moduleGraph.set(module.specifier, module.toJSON());
  }

  graph.free();

  return moduleGraph;
}
