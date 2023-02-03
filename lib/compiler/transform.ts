import init, {
  transform,
} from "https://esm.sh/@swc/wasm-web@1.3.11/wasm-web.js";
import { TransformSourceOptions } from "../types.ts";

let swcReady = false
async function ensureSWCInitialized() {
    if(swcReady) return
    if (Deno.run === undefined) {
      const wasmURL = new URL(import.meta.url.substring(0, import.meta.url.lastIndexOf("/")) + "/wasm-web_bg.wasm", import.meta.url).href;
      const r = await fetch(wasmURL)
      const resp = new Response(r.body, {
        headers: { "Content-Type": "application/wasm" },
      });
      const wasmModule = await WebAssembly.compileStreaming(resp);
      await init(wasmModule);
      swcReady = true
    } else {
      await init(import.meta.url.substring(0, import.meta.url.lastIndexOf("/")) + "/wasm-web_bg.wasm")
      swcReady = true
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

  await ensureSWCInitialized();
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
