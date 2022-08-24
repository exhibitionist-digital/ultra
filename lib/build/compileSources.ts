import type {
  Module,
} from "https://deno.land/x/deno_graph@0.31.0/lib/types.d.ts";
import type { BuildContext } from "./types.ts";
import { extname } from "../deps.ts";
import { fromFileUrl } from "./deps.ts";

type CompileSourcesOptions = {
  sourceMaps?: boolean;
  minify?: boolean;
  hash?: boolean;
};

/**
 * Compiles sources found in the ModuleGraph and overwrites the source file
 * with the compiled result.
 */
export async function compileSources(
  context: BuildContext,
  options: CompileSourcesOptions,
) {
  const { transformSource } = await import("../compiler/transform.ts");
  const compiled = new Map();

  if (context.graph) {
    for (const module of context.graph.modules) {
      const transformed = await transformSource(module.source, {
        filename: module.specifier,
        development: false,
        minify: options.minify || true,
        sourceMaps: options.sourceMaps,
      });

      const outputPath = options.hash
        ? await getModuleOutputPath(module)
        : fromFileUrl(module.specifier);

      await Deno.writeTextFile(outputPath, transformed.code);

      compiled.set(module.specifier, outputPath);
      context.files.set(module.specifier, outputPath);

      if (transformed.map) {
        await Deno.writeTextFile(`${outputPath}.map`, transformed.map);
      }
    }
  }

  return compiled;
}

async function getModuleOutputPath(module: Module) {
  let outputPath = fromFileUrl(module.specifier);
  const sourceHash = await hash(module.source);
  const extension = extname(outputPath);
  outputPath = outputPath.replace(extension, `.${sourceHash}${extension}`);

  return outputPath;
}

async function hash(code: string, length = 8) {
  const msgUint8 = new TextEncoder().encode(code);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

  return hashHex.slice(0, length);
}
