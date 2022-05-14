import {
  Application as BaseApplication,
  basename,
  dirname,
  expandGlob,
  ExpandGlobOptions,
  fromFileUrl,
  join,
  normalize,
  toFileUrl,
} from "./deps.ts";
import { readFileAndDecode } from "./utils.ts";

const extensions = [".tsx", ".ts", ".jsx", ".js"];
const globPattern = `**/*+(${extensions.join("|")})`;

/**
 * Ultra specific Application
 *
 * @see https://deno.land/x/lean
 */
export class Application extends BaseApplication {
  async resolveSources() {
    const sources = new Map<string, string>();

    try {
      const globOptions: ExpandGlobOptions = {
        root: this.rootUrl.pathname,
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
       * An array of Ultra sources that can be compiled
       * and served to a browser client.
       */
      const ultraSources = [
        join("..", "react.ts"),
        join(".", "react", "client.ts"),
        join(".", "react", "useAsync.ts"),
        join(".", "react", "useSsrData.ts"),
        join(".", "react", "useStream.ts"),
        join(".", "react", "utils.ts"),
      ];

      for (const ultra of ultraSources) {
        const path = join(
          dirname(fromFileUrl(import.meta.url)),
          normalize(ultra),
        );
        const url = toFileUrl(path);
        sources.set(String(url), await readFileAndDecode(url));
      }

      for await (const file of expandGlob(globPattern, globOptions)) {
        const filepath = toFileUrl(file.path);
        const source = await readFileAndDecode(filepath);

        sources.set(String(filepath), source);
      }

      return sources;
    } catch (error) {
      throw error;
    }
  }
}
