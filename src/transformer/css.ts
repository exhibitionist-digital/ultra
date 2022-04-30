import init, {
  browserslistToTargets,
  transform,
} from "https://unpkg.com/@parcel/css-wasm@1.8.1/index.js";
import { cache } from "https://deno.land/x/cache@0.2.13/mod.ts";
import browserslist from "https://esm.sh/browserslist@4.20.3/browserslist.js";
import { toFileUrl } from "../deps.ts";

const wasmFilepath = await cache(
  "https://unpkg.com/@parcel/css-wasm@1.8.1/parcel_css_node_bg.wasm",
);

await init(toFileUrl(wasmFilepath.path));

type TransformerOptions = {
  output?: {
    minify?: boolean;
  };
};

const encoder = new TextEncoder();

export function transformCss(
  source: string | Uint8Array,
  options?: TransformerOptions,
): Uint8Array {
  // TODO: Allow this to be configurable
  const targets = browserslistToTargets(browserslist([
    "edge >= 16",
    "firefox >= 60",
    "chrome >= 61",
    "safari >= 11",
    "opera >= 48",
  ]));

  const { code } = transform({
    filename: "style.css",
    code: typeof source === "string" ? encoder.encode(source) : source,
    minify: options?.output?.minify,
    targets,
    drafts: {
      nesting: true,
      customMedia: true,
    },
  });

  return code;
}
