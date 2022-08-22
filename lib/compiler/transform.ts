import { transform } from "https://deno.land/x/swc@0.2.1/mod.ts";
import { TransformSourceOptions } from "../types.ts";

export function transformSource(
  source: string,
  options: TransformSourceOptions,
): { code: string; map?: string } {
  const {
    filename,
    target = "es2020",
    useBuiltins = true,
    externalHelpers = true,
    dynamicImport = true,
    importSource = "react",
    runtime = "automatic",
    development,
    sourceMaps,
    minify,
  } = options;

  const transformed = transform(source, {
    // @ts-ignore This exists in the Rust API, but isn't exposed on the config type for some reason
    filename,
    jsc: {
      target,
      parser: {
        syntax: "typescript",
        dynamicImport,
        tsx: true,
      },
      externalHelpers,
      transform: {
        react: {
          useBuiltins,
          importSource,
          runtime,
          development,
        },
      },
    },
    sourceMaps: sourceMaps ? true : undefined,
    inlineSourcesContent: true,
    minify,
  });

  /**
   * Check if we should add jsx pragmas to the compiled
   * output.
   */
  if (runtime === "classic" && !transformed.code.includes("/** @jsx")) {
    transformed.code = addJsxPragmas(transformed.code);
  }

  return transformed;
}

function addJsxPragmas(code: string) {
  return `/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
${code}`;
}
