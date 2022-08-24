import type { BuildPlugin } from "../types.ts";
import { ensureDir, join, outdent } from "../deps.ts";
import { copyFiles } from "../utils/fs.ts";

export const netlify: BuildPlugin = {
  name: "netlify-edge",
  async onPreBuild(context) {
    try {
      await Deno.remove(join(context.paths.rootDir, ".netlify"), {
        recursive: true,
      });
    } catch (_error) {
      // whatever
    }
  },
  async onBuild(result) {
    const publicDir = join(result.paths.outputDir, "public");
    const netlifyDir = join(result.paths.rootDir, ".netlify");
    const staticDir = join(netlifyDir, "public");
    const edgeFunctionsDir = join(netlifyDir, "edge-functions");

    await ensureDir(netlifyDir);
    await ensureDir(staticDir);
    await ensureDir(edgeFunctionsDir);

    /**
     * Copy static assets to staticDir
     */
    const copied = await copyFiles(publicDir, staticDir);

    /**
     * Create the edge-functions/manifest.json
     */
    await Deno.writeTextFile(
      join(edgeFunctionsDir, "manifest.json"),
      outdent`
        {
          "functions": [
            {
              "path": "/*",
              "function": "server"
            }
          ],
          "import_map": "./importMap.production.json",
          "version": 1
        }
      `,
    );

    /**
     * Copy sources files to edgeFunctionsDir skipping public files
     */
    const skip = Array.from(copied.keys()).map((file) => new RegExp(file));
    await copyFiles(result.paths.outputDir, edgeFunctionsDir, skip);
  },
};
