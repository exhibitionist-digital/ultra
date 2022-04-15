import {
  initSwc,
  ParseOptions,
  parseSync,
  printSync,
  Program,
  transformSync,
} from "./deps.ts";
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

export const transformSource = async (
  options: TransformOptions,
): Promise<string> => {
  const { source, sourceUrl, importMap, cacheBuster, minify } = options;

  const importMapResolver = new ImportMapResolver(importMap, sourceUrl);
  const visitor = new UltraVisitor(importMapResolver, cacheBuster);

  const transformResult = await transformSync(source, {
    jsc: {
      parser: parserOptions,
      target: "es2019",
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
