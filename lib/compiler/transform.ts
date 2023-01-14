import { transform } from "https://deno.land/x/swc@0.2.1/mod.ts";
import { TransformSourceOptions } from "../types.ts";

export async function transformSource(
  source: string,
  options: TransformSourceOptions,
): Promise<{ code: string; map?: string }> {
  const {
    filename,
    target = "es2022",
    useBuiltins = true,
    externalHelpers = true,
    dynamicImport = true,
    jsxImportSource = "react",
    runtime = "automatic",
    development,
    sourceMaps,
    minify,
    refresh = false,
  } = options;

  const transformed = await transform(source, {
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
      minify: minify
        ? {
          mangle: true,
          compress: true,
        }
        : undefined,
      transform: {
        react: {
          useBuiltins,
          importSource: jsxImportSource,
          runtime,
          development,
          refresh,
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
