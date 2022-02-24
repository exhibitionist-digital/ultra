import { esbuild, parse } from "./deps.ts";
import { isDev } from "./env.ts";
import type {
  CallExpression,
  HasSpan,
} from "https://deno.land/x/swc@0.1.4/types/options.ts";
import { TransformOptions } from "./types.ts";

let offset = 0;
let length = 0;

const transform = async (
  { source, importmap, loader = "tsx", cacheBuster, env }: TransformOptions,
) => {
  const { code } = await esbuild.transform(source, {
    loader,
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
      c += `"${
        importmap?.imports?.[value] ||
        value.replace(
          /\.(j|t)sx?/gi,
          () => `.js${cacheBuster ? `?ts=${cacheBuster}` : ""}`,
        )
      }"`;
      offset = span.end;
    }
    if (i.type == "VariableDeclaration") {
      i.declarations?.forEach((o) =>
        (o.init as CallExpression)!.arguments?.forEach(({ expression }) => {
          // @ts-ignore deno_swc doesn't have generics
          const expressionBody = expression.body;
          // inline imports
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
                  value.replace(/\.(j|t)sx?/gi, () =>
                    `.js${
                      cacheBuster
                        ? `?ts=${cacheBuster}`
                        : ""
                    }`)
                }"`;
                offset = span.end;
              },
            );
          }
          // function imports
          const statements = expressionBody?.stmts || [];
          // @ts-ignore add typings for swc argument
          statements.forEach(({ argument }) => {
            if (argument?.callee?.value?.toLowerCase() === "import") {
              argument?.arguments?.forEach(
                (b: {
                  expression: {
                    value: string;
                  } & HasSpan;
                }) => {
                  const { value, span } = b?.expression;
                  c += code.substring(offset - length, span.start - length);
                  c += `"${
                    value.replace(/\.(j|t)sx?/gi, () =>
                      `.js${
                        cacheBuster
                          ? `?ts=${cacheBuster}`
                          : ""
                      }`)
                  }"`;
                  offset = span.end;
                },
              );
            }
          });
        })
      );
    }
  });
  c += code.substring(offset - length, code.length + offset);
  length += code.length + 1;
  offset = length;

  // slug replacer
  Object.keys(env || {}).forEach((slug) => {
    if (!slug) return;
    // @ts-ignore any
    c = c.replaceAll(slug, env[slug]);
  });

  return c;
};

export default transform;
