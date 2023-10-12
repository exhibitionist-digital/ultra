import {
  type ImportMapJson,
  parseFromJson,
} from "https://deno.land/x/import_map@v0.15.0/mod.ts";
import { toFileUrl } from "./deps.ts";

export type ImportMap = ImportMapJson;

export async function createImportMapProxy(
  target: ImportMapJson,
  root: string | URL,
) {
  const base = root instanceof URL ? root : toFileUrl(root);
  const importMap = await parseFromJson(base, target);

  const importsProxy = new Proxy(target.imports, {
    get: (target, prop) => {
      if (typeof prop === "symbol") {
        throw new TypeError("Symbol properties are not supported.");
      }

      const value = target[prop];
      const resolved = !value ? importMap.resolve(prop, base) : value;

      return resolved;
    },
  });

  return new Proxy(target, {
    get: (target, prop) => {
      if (typeof prop === "symbol") {
        throw new TypeError("Symbol properties are not supported.");
      }

      if (prop === "toJSON") {
        return () => target;
      }

      if (prop === "imports") {
        return importsProxy;
      }

      return target[prop];
    },
  });
}

type ImportMapProxyOptions = {
  root: string | URL;
};

export class ImportMapProxy {
  imports: object;
  scopes: object;

  constructor(target: ImportMapJson, options: ImportMapProxyOptions) {
    const root = options.root instanceof URL
      ? options.root
      : toFileUrl(options.root);

    this.imports = new Proxy(target.imports ?? {}, {
      get: (target, prop) => {
        if (typeof prop === "symbol") {
          throw new TypeError("Symbol properties are not supported.");
        }

        const specifier = target[prop];

        if (specifier) {
          return new URL(specifier, root).href;
        }

        return undefined;
      },
    });

    this.scopes = new Proxy(target.scopes ?? {}, {
      get: (target, prop) => {
        if (typeof prop === "symbol") {
          throw new TypeError("Symbol properties are not supported.");
        }

        const scope = target[prop];
        if (scope) {
          return new Proxy(scope, {
            get: (target, prop) => {
              if (typeof prop === "symbol") {
                throw new TypeError("Symbol properties are not supported.");
              }
              const specifier = target[prop];
              if (specifier) {
                return new URL(specifier, root).href;
              }
              return undefined;
            },
          });
        }
        return undefined;
      },
    });
  }
}
