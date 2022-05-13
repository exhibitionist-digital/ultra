import {
  Application as BaseApplication,
  expandGlob,
  ExpandGlobOptions,
  toFileUrl,
} from "./deps.ts";
import { readFileAndDecode } from "./utils.ts";

const extensions = [".tsx", ".ts", ".jsx", ".js"];
const globPattern = `**/*+(${extensions.join("|")})`;

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
          "server.tsx",
          "server.ts",
          "server.jsx",
          "server.js",
        ],
      };

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
