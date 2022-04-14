import {
  CallExpression,
  ImportDeclaration,
  StringLiteral,
  Visitor,
} from "../deps.ts";
import { ImportMap } from "../types.ts";
import { cacheBuster } from "../utils/cacheBuster.ts";
import { isApiRoute } from "../utils/isApiRoute.ts";
import { isRemoteSource } from "../utils/isRemoteSource.ts";

export class UltraVisitor extends Visitor {
  constructor(private importMap: ImportMap, private cacheTimestamp?: number) {
    super();
  }

  visitImportDeclaration(node: ImportDeclaration) {
    node.source = this.replaceImportStringLiteral(node.source);
    return super.visitImportDeclaration(node);
  }

  visitCallExpression(node: CallExpression) {
    if (node.callee.type === "Import") {
      node.arguments = node.arguments.map((argument) => {
        if (argument.expression.type === "StringLiteral") {
          argument.expression = this.replaceImportStringLiteral(
            argument.expression,
          );
        }

        return argument;
      });
    }
    return super.visitCallExpression(node);
  }

  private replaceImportStringLiteral(node: StringLiteral) {
    const { value } = node;
    const importMapResolved = this.importMap.imports[value] || value;

    node.value = importMapResolved.replace(
      "./.ultra",
      "",
    );

    const isCacheBustable = !isRemoteSource(importMapResolved) &&
      !isApiRoute(importMapResolved) && this.cacheTimestamp;

    if (isCacheBustable) {
      node.value = cacheBuster(
        node.value,
        this.cacheTimestamp,
      );
    }

    //@ts-ignore StringLiteral missing raw field
    node.raw = `"${node.value}"`;

    return node;
  }
}
