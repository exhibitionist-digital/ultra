import { TransformSourceOptions } from "../types.ts";

import * as esbuildWasm from "https://deno.land/x/esbuild@v0.14.51/wasm.js";
import * as esbuildNative from "https://deno.land/x/esbuild@v0.14.51/mod.js";
// @ts-ignore trust me
const esbuild: typeof esbuildWasm = Deno.run === undefined
  ? esbuildWasm
  : esbuildNative;

let esbuildReady = false
async function ensureEsBuildInitialized() {
    if(esbuildReady) return
    if (Deno.run === undefined) {
      const wasmURL = new URL(import.meta.url.substring(0, import.meta.url.lastIndexOf("/")) + "/esbuild_v0.14.51.wasm", import.meta.url).href;
      const r = await fetch(wasmURL)
      const resp = new Response(r.body, {
        headers: { "Content-Type": "application/wasm" },
      });
      const wasmModule = await WebAssembly.compileStreaming(resp);
      await esbuild.initialize({
        wasmModule,
          worker: false,
      })
      esbuildReady = true
    } else {
      await esbuild.initialize({})
      esbuildReady = true
    }
}

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

  await ensureEsBuildInitialized()
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
