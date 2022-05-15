import {
  basename,
  debug,
  expandGlob,
  ExpandGlobOptions,
  join,
  toFileUrl,
} from "./deps.ts";
import { relativeImportMetaPath } from "./utils.ts";

const invalidated = "__$$invalidated$$__";

const log = debug("ultra:sources");

export class Sources extends Map {
  // deno-lint-ignore no-explicit-any
  constructor(private loadSource: (key: string) => Promise<any>) {
    super();
  }

  async load(key: string | URL) {
    key = typeof key === "string" ? key : key.toString();

    const value = await this.loadSource(key);
    this.set(key, value);

    return value;
  }

  async get<T = string>(key: string): Promise<T | undefined> {
    let value = super.get(key);

    if (value === invalidated) {
      log(`Source load: ${key}`);
      value = await this.load(key);
    }

    return value;
  }

  invalidate(key: string) {
    if (this.has(key)) {
      log(`Source invalidated: ${key}`);
      this.set(key, invalidated);
    }

    return this;
  }
}

const extensions = [".tsx", ".ts", ".jsx", ".js"];
const globPattern = `**/*+(${extensions.join("|")})`;

export async function resolveSourceUrls(
  from: string,
  rootUrl: URL,
): Promise<URL[]> {
  const urls: URL[] = [];

  const globOptions: ExpandGlobOptions = {
    root: rootUrl.pathname,
    /**
     * Might need a better way of defining this... maybe configurable?
     *
     * This excludes certain directories/files from being considered
     * valid compile targets and preventing a request for
     * http://localhost/@compiler/ultra/server.tsx.js and being sent the compiled source.
     */
    exclude: [
      "vendor",
      "tests",
      ".ultra",
      /**
       * Note[deckchairlabs]: Deno.mainModule is undefined on Deno Deploy
       * At least, the last time I checked...
       */
      basename(Deno.mainModule),
    ],
  };

  /**
   * An array of extra filepaths that can be compiled
   * and served to a browser client.
   *
   * These paths are relative to this file "app.ts".
   */
  const extraCompilerTargets = [
    join("..", "react.ts"),
    join(".", "react", "client.ts"),
    join(".", "react", "useSsrData.ts"),
    join(".", "react", "useStream.ts"),
    join(".", "react", "utils.ts"),
  ];

  const localCompilerTargets = expandGlob(globPattern, globOptions);

  for (const target of extraCompilerTargets) {
    urls.push(relativeImportMetaPath(target, from));
  }

  for await (const local of localCompilerTargets) {
    urls.push(toFileUrl(local.path));
  }

  log("Resolved", urls.map(String));

  return urls;
}
