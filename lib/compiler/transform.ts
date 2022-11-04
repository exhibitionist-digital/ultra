import init, {
  transform,
} from "https://esm.sh/@swc/wasm-web@1.3.11/wasm-web.js";
import { cache } from "https://deno.land/x/cache@0.2.13/mod.ts";
import { TransformSourceOptions } from "../types.ts";
import { toFileUrl } from "../deps.ts";

const file = await cache(
  "https://esm.sh/@swc/wasm-web@1.3.11/wasm-web_bg.wasm",
);

await init(toFileUrl(file.path));

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
