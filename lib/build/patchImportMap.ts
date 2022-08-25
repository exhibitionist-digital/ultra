import { ULTRA_STATIC_PATH } from "../constants.ts";
import { ImportMap } from "../types.ts";
import { fromFileUrl, relative, SEP } from "./deps.ts";
import { BuildContext, BuildTarget } from "./types.ts";

function toRelativeSpecifier(from: string, specifier: string) {
  specifier = relative(
    from,
    specifier.startsWith("file://") ? fromFileUrl(specifier) : specifier,
  );

  return `.${SEP}${specifier}`;
}
/**
 * @param context
 * @param compiled
 */
export function patchImportMap(
  context: BuildContext,
  compiled: Map<string, string>,
  importMap: ImportMap,
  target: BuildTarget,
) {
  if (context.graph) {
    for (const module of context.graph.modules) {
      let specifier = toRelativeSpecifier(
        context.paths.outputDir,
        module.specifier,
      );

      let resolved = toRelativeSpecifier(
        context.paths.outputDir,
        compiled.get(
          module.specifier,
        )!,
      );

      if (target === "browser") {
        /**
         * This will result in something like "/_ultra/static/client.tsx"
         */
        specifier = `${ULTRA_STATIC_PATH}/${specifier.replace("./", "")}`;
        /**
         * This will result in something like "/_ultra/static/client.9d29f9c0.tsx"
         */
        resolved = `${ULTRA_STATIC_PATH}/${resolved.replace("./", "")}`;
      }

      importMap.imports[specifier] = resolved;
    }
  }

  return importMap;
}
