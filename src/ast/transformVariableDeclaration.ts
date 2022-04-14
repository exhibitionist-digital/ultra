import { VariableDeclaration } from "../deps.ts";
import { ImportMap } from "../types.ts";
import { transformCallExpression } from "./transformCallExpression.ts";

export function transformVariableDeclaration(
  declaration: VariableDeclaration,
  importMap: ImportMap,
  cacheTimestamp?: number,
) {
  declaration.declarations = declaration.declarations.map(
    (variableDeclarator) => {
      switch (variableDeclarator.init?.type) {
        case "CallExpression":
          variableDeclarator.init = transformCallExpression(
            variableDeclarator.init,
            importMap,
            cacheTimestamp,
          );
      }

      return variableDeclarator;
    },
  );

  return declaration;
}
