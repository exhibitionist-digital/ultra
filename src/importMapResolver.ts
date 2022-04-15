import { ParsedImportMap, parseImportMap, resolveImportMap } from "./deps.ts";
import { ImportMap } from "./types.ts";

export class ImportMapResolver {
  private parsedImportMap: ParsedImportMap;

  constructor(importMap: ImportMap, baseUrl: URL) {
    this.parsedImportMap = parseImportMap(importMap, baseUrl);
  }

  resolve(specifier: string, scriptUrl: URL) {
    const resolvedImport = resolveImportMap(
      specifier,
      this.parsedImportMap,
      scriptUrl,
    );

    return resolvedImport;
  }
}
