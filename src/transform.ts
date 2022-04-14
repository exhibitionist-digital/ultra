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
import { hashFile } from "./resolver.ts";
import { UltraVisitor } from "./ast/ultra.ts";

await initSwc("https://cdn.esm.sh/@swc/wasm-web@1.2.165/wasm_bg.wasm");

const parserOptions: ParseOptions = {
  syntax: "typescript",
  tsx: true,
  dynamicImport: true,
};

const transform = async (
  { source, importMap, cacheBuster }: TransformOptions,
) => {
  const visitor = new UltraVisitor(importMap, cacheBuster);

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

let offset = 0;
let length = 0;

const vendor = async (
  { source, root }: { source: string; root: string },
) => {
  root;
  let c = "";
  const code = source;

  const ast = await parseSync(code, parserOptions) as Program;

  ast.body.forEach((i) => {
    const prefix = "./";
    if (i.type == "ExportAllDeclaration") {
      const { value, span } = i.source;
      c += code.substring(offset - length, span.start - length);
      const url = new URL(value);
      c += `"${prefix + hashFile(value.replace(url.origin, ""))}.js"`;
      offset = span.end;
    }
    if (i.type == "ExportNamedDeclaration") {
      if (!i.source) return;
      const { value, span } = i.source;
      c += code.substring(offset - length, span.start - length);
      const url = new URL(value);

      c += `"${prefix + hashFile(value.replace(url.origin, ""))}.js"`;
      offset = span.end;
    }
    if (i.type == "ImportDeclaration") {
      const { value, span } = i.source;
      c += code.substring(offset - length, span.start - length);

      c += `"${prefix + hashFile(value)}.js"`;
      offset = span.end;
    }
  });
  c += code.substring(offset - length, code.length + offset);
  length += code.length + 1;
  offset = length;

  return c;
};

export { vendor };
