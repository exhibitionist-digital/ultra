import * as esbuild from "https://deno.land/x/esbuild@v0.17.0/mod.js"
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

  const transformed = await esbuild.transform(source, {
    loader: "tsx",
    jsx: "automatic",
    minify: false,
    jsxImportSource: "react",
    sourcemap: true,
  })
  source = 'import React from "react";' + transformed.code 

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
