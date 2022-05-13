import { ParsedImportMap, parseImportMap, resolveSpecifier } from "./deps.ts";
import { ImportMap } from "./types.ts";

export class ImportMapResolver {
  private parsedImportMap: ParsedImportMap;

  constructor(importMap: ImportMap, private baseUrl: URL) {
    this.parsedImportMap = parseImportMap(importMap, baseUrl);
  }

  resolve(specifier: string, scriptUrl?: URL) {
    const resolvedImport = resolveSpecifier(
      specifier,
      this.parsedImportMap,
      scriptUrl || this.baseUrl,
    );

    return resolvedImport;
  }

  resolveUrl(specifier: string, scriptUrl?: URL) {
    const resolvedImport = this.resolve(specifier, scriptUrl);
    return resolvedImport?.resolvedImport;
  }

  resolveHref(specifier: string, scriptUrl?: URL) {
    const resolvedImport = this.resolve(specifier, scriptUrl);
    return resolvedImport?.resolvedImport?.href;
  }

  /**
   * Returns a Map with concrete keys based on the passed specifiers.
   *
   * @param specifiers An array of string import specifiers to be resolved from the importMap.
   */
  getDependencyMap<T extends Readonly<string[]>>(specifiers: T) {
    return new Map<T[number], string>(specifiers.map(
      (dependency) => {
        const resolvedDependency = this.resolve(dependency);
        return [dependency, resolvedDependency.resolvedImport.href];
      },
    ));
  }
}
