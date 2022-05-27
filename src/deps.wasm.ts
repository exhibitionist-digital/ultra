import { cache } from "./deps.ts";

export const swcWasmCache = await cache(
  "https://cdn.esm.sh/@swc/wasm-web@1.2.171/wasm-web_bg.wasm",
);
