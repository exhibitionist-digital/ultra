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
import { transformImportDeclaration } from "./ast/transformImportDeclaration.ts";
import { transformVariableDeclaration } from "./ast/transformVariableDeclaration.ts";

await initSwc("https://cdn.esm.sh/@swc/wasm-web@1.2.165/wasm_bg.wasm");

const parserOptions: ParseOptions = {
  syntax: "typescript",
  tsx: true,
  dynamicImport: true,
};

const transform = async (
  { source, importMap, cacheBuster }: TransformOptions,
) => {
  const transformResult = await transformSync(source, {
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: true,
      },
      target: "es2021",
      transform: {},
    },
  });

  const ast = await parseSync(transformResult.code, parserOptions) as Program;

  ast.body = ast.body.map((declaration) => {
    switch (declaration.type) {
      case "ImportDeclaration": {
        return transformImportDeclaration(
          declaration,
          importMap,
          cacheBuster,
        );
      }

      case "VariableDeclaration": {
        return transformVariableDeclaration(
          declaration,
          importMap,
          cacheBuster,
        );
      }
    }

    return declaration;
  });

  const { code } = printSync(ast, {
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
