import {
  initSwc,
  ParseOptions,
  parseSync,
  printSync,
  Program,
  toFileUrl,
  TransformConfig,
  transformSync,
} from "./deps.ts";
import { TransformOptions } from "./types.ts";
import { UltraVisitor } from "./ast/ultra.ts";
import { ImportMapResolver } from "./importMapResolver.ts";
import { VendorVisitor } from "./ast/vendor.ts";
import { swcWasmCache } from "./deps.wasm.ts";

await initSwc(toFileUrl(swcWasmCache.path));

const parserOptions: ParseOptions = {
  syntax: "typescript",
  tsx: true,
  dynamicImport: true,
};

const transformConfig: TransformConfig = {};

export const transformSource = async (
  options: TransformOptions,
): Promise<string> => {
  const { source, sourceUrl, importMap, minify, relativePrefix } = options;

  const importMapResolver = new ImportMapResolver(importMap, sourceUrl);
  const visitor = new UltraVisitor(
    importMapResolver,
    relativePrefix,
    sourceUrl,
  );

  const transformResult = await transformSync(source, {
    jsc: {
      parser: parserOptions,
      transform: transformConfig,
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
