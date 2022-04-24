import {
  initSwc,
  ParseOptions,
  parseSync,
  printSync,
  Program,
  toFileUrl,
  transformSync,
} from "./deps.ts";
import { cache } from "https://deno.land/x/cache@0.2.13/mod.ts";
import { TransformOptions } from "./types.ts";
import { UltraVisitor } from "./ast/ultra.ts";
import { ImportMapResolver } from "./importMapResolver.ts";
import { VendorVisitor } from "./ast/vendor.ts";

const wasmCache = await cache(
  "https://cdn.esm.sh/@swc/wasm-web@1.2.165/wasm_bg.wasm",
);
await initSwc(toFileUrl(wasmCache.path));

const parserOptions: ParseOptions = {
  syntax: "typescript",
  tsx: true,
  dynamicImport: true,
};

export const transformSource = async (
  options: TransformOptions,
): Promise<string> => {
  const { source, sourceUrl, importMap, cacheBuster, minify, relativePrefix } =
    options;

  const importMapResolver = new ImportMapResolver(importMap, sourceUrl);
  const visitor = new UltraVisitor(
    importMapResolver,
    cacheBuster,
    relativePrefix,
    sourceUrl,
  );

  const transformResult = await transformSync(source, {
    jsc: {
      parser: parserOptions,
      target: "es2021",
    },
  });

  const ast = await parseSync(transformResult.code, parserOptions) as Program;
  const transformedAst = visitor.visitProgram(ast);

  const { code } = printSync(transformedAst, {
    minify,
  });

  return code;
};

export default transformSource;

const vendor = async (
  { source }: { source: string; root: string },
): Promise<string> => {
  const visitor = new VendorVisitor();

  const ast = await parseSync(source, parserOptions) as Program;
  const transformedAst = visitor.visitProgram(ast);

  const { code } = printSync(transformedAst, {
    minify: true,
  });

  return code;
};

export { vendor };
