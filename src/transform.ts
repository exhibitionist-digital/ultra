import {
  initSwc,
  ParseOptions,
  parseSync,
  printSync,
  Program,
  transformSync,
} from "./deps.ts";
import { isDev } from "./env.ts";
import { TransformOptions } from "./types.ts";
import { UltraVisitor } from "./ast/ultra.ts";
import { ImportMapResolver } from "./importMapResolver.ts";
import { VendorVisitor } from "./ast/vendor.ts";

await initSwc("https://cdn.esm.sh/@swc/wasm-web@1.2.165/wasm_bg.wasm");

const parserOptions: ParseOptions = {
  syntax: "typescript",
  tsx: true,
  dynamicImport: true,
};

const transform = async (
  { source, sourceUrl, importMap, cacheBuster }: TransformOptions,
) => {
  const importMapResolver = new ImportMapResolver(importMap, sourceUrl);
  const visitor = new UltraVisitor(importMapResolver, cacheBuster);

  const transformResult = await transformSync(source, {
    jsc: {
      parser: parserOptions,
      target: "es2019",
      transform: {},
    },
  });

  const ast = await parseSync(transformResult.code, parserOptions) as Program;
  const transformedAst = visitor.visitProgram(ast);

  const { code } = printSync(transformedAst, {
    minify: !isDev,
  });

  return code;
};

export default transform;

const vendor = async (
  { source }: { source: string; root: string },
) => {
  const visitor = new VendorVisitor();

  const ast = await parseSync(source, parserOptions) as Program;
  const transformedAst = visitor.visitProgram(ast);

  const { code } = printSync(transformedAst, {
    minify: !isDev,
  });

  return code;
};

export { vendor };
