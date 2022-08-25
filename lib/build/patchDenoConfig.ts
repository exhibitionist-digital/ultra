import { DenoConfig } from "../types.ts";
import { importJsonModule, writeJsonFile } from "../utils/json.ts";
import { ResolvedPaths } from "./resolvePaths.ts";

/**
 * Patches a deno.json file with required options
 * for a production runtime environment.
 */
export async function patchDenoConfig(paths: ResolvedPaths) {
  const denoConfig: DenoConfig = await importJsonModule(
    paths.resolveOutputFileUrl("deno.json"),
  );

  // If the jsx compiler option is set, we force it to "react-jsx"
  if (denoConfig?.compilerOptions?.jsx) {
    denoConfig.compilerOptions.jsx = "react-jsx";
    denoConfig.compilerOptions.jsxImportSource = "react";
  }

  if (denoConfig.importMap) {
    denoConfig.importMap = "./importMap.server.json";
  }

  await writeJsonFile(
    paths.resolveOutputFileUrl("deno.json"),
    denoConfig,
  );

  return denoConfig;
}
