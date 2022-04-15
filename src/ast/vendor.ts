import {
  ExportAllDeclaration,
  ExportNamedDeclaration,
  ImportDeclaration,
  Visitor,
} from "../deps.ts";
import { hashFile } from "../resolver.ts";

const prefix = "./";

export class VendorVisitor extends Visitor {
  visitExportAllDeclaration(node: ExportAllDeclaration) {
    const { value } = node.source;
    const url = new URL(value);

    node.source.value = `${
      prefix + hashFile(value.replace(url.origin, ""))
    }.js`;

    //@ts-ignore StringLiteral missing raw field
    node.source.raw = `"${node.source.value}"`;

    return super.visitExportAllDeclaration(node);
  }

  visitExportNamedDeclaration(node: ExportNamedDeclaration) {
    if (node.source) {
      const { value } = node.source;
      const url = new URL(value);

      node.source.value = `${
        prefix + hashFile(value.replace(url.origin, ""))
      }.js`;

      //@ts-ignore StringLiteral missing raw field
      node.source.raw = `"${node.source.value}"`;
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
}
