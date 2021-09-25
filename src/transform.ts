import * as esbuild from "https://deno.land/x/esbuild@v0.13.2/mod.js";
import { parse } from "https://x.nest.land/swc@0.1.4/mod.ts";
import type {
  CallExpression,
  HasSpan,
} from "https://deno.land/x/swc@0.1.4/types/options.ts";
import { TransformOptions } from "./types.ts";

const isDev = Deno.env.get("mode") === "dev";
const serverStart = +new Date();

let offset = 0;
let length = 0;

const transform = async (
  { source, importmap, root }: TransformOptions,
) => {
  const t0 = performance.now();
  const { code } = await esbuild.transform(source, {
    loader: "tsx",
    target: ["esnext"],
    minify: !isDev,
  });
  let c = "";
  const ast = parse(code, {
    syntax: "typescript",
    tsx: true,
    dynamicImport: true,
  });
  ast.body.forEach((i) => {
    if (i.type == "ImportDeclaration") {
      const { value, span } = i.source;
      c += code.substring(offset - length, span.start - length);
      c += `"${importmap?.imports?.[value] ||
        value.replace(
          /.jsx|.tsx/gi,
          () => `.js?ts=${isDev ? +new Date() : serverStart}`,
        )}"`;
      offset = span.end;
    }
    if (i.type == "VariableDeclaration") {
      i.declarations?.forEach((o) =>
        (o.init as CallExpression)!.arguments?.forEach(({ expression }) => {
          // @ts-ignore deno_swc doesn't have generics
          const expressionBody = expression.body;

          if (expressionBody?.callee?.value?.toLowerCase() === "import") {
            expressionBody?.arguments?.forEach(
              (b: {
                expression: {
                  value: string;
                } & HasSpan;
              }) => {
                const { value, span } = b?.expression;
                c += code.substring(offset - length, span.start - length);
                c += `"${
                  value.replace(/.jsx|.tsx/gi, () =>
                    `.js?ts=${
                      isDev
                        ? +new Date()
                        : serverStart
                    }`)
                }"`;
                offset = span.end;
              },
            );
          }
        })
      );
    }
  });
  c += code.substring(offset - length, code.length + offset);
  length += code.length + 1;
  offset = length;
  const t1 = performance.now();
  console.log(`Transpile: in ${t1 - t0}ms`);
  c = c.replaceAll("ULTRA_URL", root);
  return c;
};

export default transform;
