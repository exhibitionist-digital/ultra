import { resolve, toFileUrl } from "../deps.ts";
import { ImportMap, Mode } from "../types.ts";

export function resolveImportMapPath(mode: Mode, root: string, path: string) {
  if (mode === "development") {
    return path;
  }

  return toFileUrl(resolve(root, "./importMap.browser.json")).href;
}

export function importMapRelative(importMap: ImportMap, to: string): ImportMap {
  let imports = importMap.imports;
  const scopes = importMap.scopes;

  imports = importsRelative(imports, to);

  if (scopes) {
    for (const scopeEntry of Object.entries(scopes)) {
      const [scope, imports] = scopeEntry;
      scopes[relativePath(scope, to)] = importsRelative(
        imports,
        to,
      );

      delete scopes[scope];
    }
  }

  return { imports, scopes } as const;
}

function importsRelative(imports: Record<string, string>, to: string) {
  for (const importEntry of Object.entries(imports)) {
    const [specifier, path] = importEntry;
    imports[specifier] = relativePath(path, to);
  }

  return imports;
}

function relativePath(path: string, to: string) {
  return path.replace("./", to);
}
