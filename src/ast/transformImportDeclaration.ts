import { ImportDeclaration } from "../deps.ts";
import { ImportMap } from "../types.ts";
import { transformStringLiteralImport } from "./transformStringLiteralImport.ts";

export function transformImportDeclaration(
  declaration: ImportDeclaration,
  importMap: ImportMap,
  cacheTimestamp?: number,
): ImportDeclaration {
  declaration.source = transformStringLiteralImport(
    declaration.source,
    importMap,
    cacheTimestamp,
  );

  return declaration;
}
