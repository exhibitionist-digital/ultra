import {
  CallExpression,
  ImportDeclaration,
  StringLiteral,
  Visitor,
} from "../deps.ts";
import { isRemoteSource, isVendorSource, replaceFileExt } from "../resolver.ts";
import { ImportMapResolver } from "../importMapResolver.ts";
import { vendorDirectory } from "../env.ts";

export class UltraVisitor extends Visitor {
  constructor(
    private importMapResolver: ImportMapResolver,
    private relativePrefix?: string,
    private sourceUrl?: URL,
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

    const resolvedImport = this.importMapResolver.resolve(
      value,
    );

    node.value = resolvedImport.matched
      ? resolvedImport.resolvedImport.href
      : value;

    if (this.relativePrefix) {
      node.value = node.value.replace(
        this?.sourceUrl?.href || "",
        this.relativePrefix,
      );
    } else if (isVendorSource(node.value, vendorDirectory)) {
      node.value = this?.sourceUrl?.origin + `/${vendorDirectory}/` +
        node.value.split(`.ultra/${vendorDirectory}/`)[1];
    }

    if (!isRemoteSource(node.value)) {
      node.value = replaceFileExt(node.value, ".js");
    }

    //@ts-ignore StringLiteral missing raw field
    node.raw = `"${node.value}"`;

    return node;
  }
}
