import {
  common,
  ExportAllDeclaration,
  ExportNamedDeclaration,
  resolveSpecifier,
  Visitor,
} from "../deps.ts";
import type {
  CallExpression,
  ImportDeclaration,
  ParsedImportMap,
  StringLiteral,
} from "../deps.ts";

export class ImportVisitor extends Visitor {
  constructor(
    private importMap: ParsedImportMap,
  ) {
    super();
  }

  visitImportDeclaration(node: ImportDeclaration) {
    node.source = this.replaceStringLiteralSpecifier(node.source);
    return super.visitImportDeclaration(node);
  }

  visitExportAllDeclaration(node: ExportAllDeclaration) {
    node.source = this.replaceStringLiteralSpecifier(node.source);
    return super.visitExportAllDeclaration(node);
  }

  visitExportNamedDeclaration(node: ExportNamedDeclaration) {
    if (node.source) {
      node.source = this.replaceStringLiteralSpecifier(node.source);
    }

    return super.visitExportNamedDeclaration(node);
  }

  visitCallExpression(node: CallExpression) {
    if (node.callee.type === "Import") {
      node.arguments = node.arguments.map((argument) => {
        if (argument.expression.type === "StringLiteral") {
          argument.expression = this.replaceStringLiteralSpecifier(
            argument.expression,
          );
        }

        return argument;
      });
    }
    return super.visitCallExpression(node);
  }

  private replaceStringLiteralSpecifier(node: StringLiteral) {
    const { value } = node;

    const resolvedSpecifier = resolveSpecifier(
      value,
      this.importMap,
      new URL("", import.meta.url),
    );

    if (resolvedSpecifier.matched) {
      node.value = resolvedSpecifier.resolvedImport.href;
    }

    const isUltraSpecifier = Boolean(common([node.value, import.meta.url]));

    /**
     * Detect Ultra internals
     */
    if (resolvedSpecifier.matched && isUltraSpecifier) {
      node.value = `/@ultra/compiler/${node.value}`;
    }

    const isExternalSpecifier = node.value.startsWith("http");

    if (!isExternalSpecifier) {
      if (
        node.value.endsWith(".ts") ||
        node.value.endsWith(".tsx") ||
        node.value.endsWith(".jsx") ||
        node.value.endsWith(".js")
      ) {
        node.value = `${node.value}.js`;
      }
    }

    //@ts-ignore StringLiteral missing raw field
    node.raw = `"${node.value}"`;

    return node;
  }
}
