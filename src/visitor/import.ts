import { resolveSpecifier, Visitor } from "../deps.ts";
import type {
  CallExpression,
  ImportDeclaration,
  ParsedImportMap,
  StringLiteral,
} from "../deps.ts";

export class ImportVisitor extends Visitor {
  constructor(
    private importMap: ParsedImportMap,
    private referrer: URL,
    public readonly preload: Set<string>,
  ) {
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

    const resolvedSpecifier = resolveSpecifier(
      value,
      this.importMap,
      this.referrer,
    );

    if (resolvedSpecifier.matched) {
      node.value = resolvedSpecifier.resolvedImport.href;
    }

    const isExternalSpecifier = node.value.startsWith("http");

    if (!isExternalSpecifier) {
      if (
        node.value.endsWith(".ts") ||
        node.value.endsWith(".tsx") ||
        node.value.endsWith(".jsx") ||
        node.value.endsWith(".js")
      ) {
        /**
         * We want any transpiled specifier to be relative to the
         * referring script url. This could be something like a document referrer
         * http://localhost or a script http://localhost/app.tsx.js for instance
         */
        node.value = new URL(`${node.value}.js`, this.referrer).pathname;
      }
    }

    this.preload.add(node.value);

    //@ts-ignore StringLiteral missing raw field
    node.raw = `"${node.value}"`;

    return node;
  }
}
