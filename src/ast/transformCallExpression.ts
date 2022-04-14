import { CallExpression } from "../deps.ts";
import { ImportMap } from "../types.ts";
import { transformArrowFunctionImport } from "./transformArrowFunctionImport.ts";
import { transformFunctionExpressionImport } from "./transformFunctionExpressionImport.ts";

export function transformCallExpression(
  expression: CallExpression,
  importMap: ImportMap,
  cacheTimestamp?: number,
) {
  expression.arguments = expression.arguments.map((argument) => {
    switch (argument.expression.type) {
      case "ArrowFunctionExpression": {
        argument.expression = transformArrowFunctionImport(
          argument.expression,
          importMap,
          cacheTimestamp,
        );
        break;
      }

      case "FunctionExpression": {
        argument.expression = transformFunctionExpressionImport(
          argument.expression,
          importMap,
          cacheTimestamp,
        );
        break;
      }
    }

    return argument;
  });

  return expression;
}
