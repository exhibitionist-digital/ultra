import { ArrowFunctionExpression } from "../deps.ts";
import { ImportMap } from "../types.ts";
import { transformStringLiteralImport } from "./transformStringLiteralImport.ts";

export function transformArrowFunctionImport(
  expression: ArrowFunctionExpression,
  importMap: ImportMap,
  cacheTimestamp?: number,
) {
  if (
    expression.body.type === "CallExpression" &&
    expression.body.callee.type === "Import"
  ) {
    expression.body.arguments = expression.body
      .arguments.map((argument) => {
        if (argument.expression.type === "StringLiteral") {
          argument.expression = transformStringLiteralImport(
            argument.expression,
            importMap,
            cacheTimestamp,
          );
        }

        return argument;
      });
  }

  return expression;
}
