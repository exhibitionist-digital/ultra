import { FunctionExpression } from "../deps.ts";
import { ImportMap } from "../types.ts";
import { transformStringLiteralImport } from "./transformStringLiteralImport.ts";

export function transformFunctionExpressionImport(
  expression: FunctionExpression,
  importMap: ImportMap,
  cacheTimestamp?: number,
) {
  if (expression.body.type === "BlockStatement") {
    expression.body.stmts = expression.body.stmts.map((statement) => {
      switch (statement.type) {
        case "ReturnStatement":
          if (
            statement.argument.type === "CallExpression" &&
            statement.argument.callee.type === "Import"
          ) {
            statement.argument.arguments = statement.argument.arguments.map(
              (argument) => {
                if (argument.expression.type === "StringLiteral") {
                  argument.expression = transformStringLiteralImport(
                    argument.expression,
                    importMap,
                    cacheTimestamp,
                  );
                }
                return argument;
              },
            );
          }
          break;
      }

      return statement;
    });
  }

  return expression;
}
