import {
  Application as BaseApplication,
  expandGlob,
  ExpandGlobOptions,
  toFileUrl,
} from "./deps.ts";
import { readFileAndDecode } from "./utils.ts";

const extensions = [".tsx", ".ts", ".jsx", ".js"];
const globPattern = `**/*+(${extensions.join("|")})`;
const exclude = ["vendor", "tests", ".ultra"];

export class Application extends BaseApplication {
  async resolveSources() {
    const sources = new Map<string, string>();

    try {
      const globOptions: ExpandGlobOptions = {
        root: this.rootUrl.pathname,
        exclude,
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
