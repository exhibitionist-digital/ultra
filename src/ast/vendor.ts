import {
  ExportAllDeclaration,
  ExportNamedDeclaration,
  ImportDeclaration,
  StringLiteral,
  Visitor,
} from "../deps.ts";
import { hashFile } from "../hashFile.ts";
import { isValidUrl } from "../resolver.ts";

const prefix = "./";

export class VendorVisitor extends Visitor {
  constructor(origin: string) {
    super();
    // @ts-ignore origin
    this.origin = origin;
  }
  visitExportAllDeclaration(node: ExportAllDeclaration) {
    node.source = this.replaceImportStringLiteral(node.source);
    return super.visitExportAllDeclaration(node);
  }

  visitExportNamedDeclaration(node: ExportNamedDeclaration) {
    if (node.source) {
      node.source = this.replaceImportStringLiteral(node.source);
    }
    return super.visitExportNamedDeclaration(node);
  }

  visitImportDeclaration(node: ImportDeclaration) {
    const { value } = node.source;

    node.source.value = `${prefix + hashFile(value)}.js`;

    //@ts-ignore StringLiteral missing raw field
    node.source.raw = `"${node.source.value}"`;

    return super.visitImportDeclaration(node);
  }

  private replaceImportStringLiteral(node: StringLiteral) {
    let { value } = node;
    // @ts-ignore origin
    if (!isValidUrl(value)) value = this.origin + value;
    const url = new URL(value);

    node.value = `${prefix + hashFile(value.replace(url.origin, ""))}.js`;

    //@ts-ignore StringLiteral missing raw field
    node.raw = `"${node.value}"`;

    return node;
  }
}
