import {
  basename,
  debug,
  expandGlob,
  ExpandGlobOptions,
  join,
  toFileUrl,
} from "./deps.ts";
import { relativeImportMetaPath } from "./utils.ts";

const log = debug("ultra:sources");

type SourceFile = {
  url: URL;
  code: string;
  invalidated?: boolean;
};

export class SourceFiles extends Map {
  constructor(private loadSource: (url: URL) => Promise<string>) {
    super();
  }

  keys(): IterableIterator<string> {
    return super.keys();
  }

  /**
   * Returns an array of valid pathnames for Deno.watchFs.
   */
  watchTargets() {
    return Array.from(this.keys()).filter((url) => !url.startsWith("http")).map(
      (url) => new URL(url).pathname,
    );
  }

  entries(): IterableIterator<[string, SourceFile]> {
    return super.entries();
  }

  /**
   * Loads the source code of the passed {@link URL}, can be a local or remote.
   */
  async load(url: URL) {
    const code = await this.loadSource(url);
    const source: SourceFile = { url, code };
    this.set(url.toString(), source);

    log(`Source loaded: ${url}`);

    return source;
  }

  /**
   * Returns the {@link SourceFile} of the provided {@link URL}.
   * If the {@link SourceFile} has been marked as "invalidated" the source is reloaded.
   */
  async get(url: URL) {
    let source: SourceFile | undefined = super.get(url.toString());

    if (source && source.invalidated) {
      source = await this.load(url);
    }

    return source;
  }

  /**
   * Marks the {@link SourceFile} as invalidated.
   */
  async invalidate(url: URL) {
    const source = await this.get(url);

    if (source) {
      log(`Source invalidated: ${url}`);
      this.set(url.toString(), { ...source, invalidated: true });
    }

    return this;
  }
}

const extensions = [".tsx", ".ts", ".jsx", ".js", ".css"];
const globPattern = `**/*+(${extensions.join("|")})`;

/**
 * Returns an array of source file urls.
 */
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
      ".ultra",
      "vendor",
      "tests",
      "api",
      "src/api",
      /**
       * Note[deckchairlabs]: Deno.mainModule is undefined on Deno Deploy
       * At least, the last time I checked...
       */
      basename(Deno.mainModule),
    ],
  };

  /**
   * An array of remote filepaths that can be compiled
   * and served to a browser client.
   *
   * These paths are relative to the "from" parameter.
   */
  const remoteCompilerTargets = [
    join("..", "react.ts"),
    join(".", "react", "client.ts"),
    join(".", "react", "useSsrData.ts"),
    join(".", "react", "useStream.ts"),
    join(".", "react", "utils.ts"),
  ];

  const localCompilerTargets = expandGlob(globPattern, globOptions);

  for (const target of remoteCompilerTargets) {
    urls.push(relativeImportMetaPath(target, from));
  }

  for await (const local of localCompilerTargets) {
    urls.push(toFileUrl(local.path));
  }

  log("Resolved", urls.map(String));

  return urls;
}
