import { hash } from "../utils/hash.ts";
import { writeJsonFile } from "../utils/json.ts";
import { globToRegExp, join } from "./deps.ts";
import type { BuildContext } from "./types.ts";
import { addFileContentHash } from "./utils/path.ts";

export async function assetManifest(context: BuildContext) {
  const PUBLIC_ASSET_REGEX = globToRegExp(
    join(context.paths.outputDir, "public", "**", "*"),
    {
      extended: true,
      globstar: true,
      caseInsensitive: false,
    },
  );

  const publicDir = context.paths.resolveBuildPath("public");
  const assets = new Map<string, string>();

  for (const [source, outputPath] of context.files.entries()) {
    if (PUBLIC_ASSET_REGEX.test(outputPath)) {
      const content = await Deno.readFile(source);
      const sourceHash = await hash(content);

      /**
       * Strip publicDir from the path to get the absolute
       * url to the asset.
       */
      const publicUrl = outputPath.replace(publicDir, "");
      const hashedPublicUrl = addFileContentHash(publicUrl, sourceHash);

      await Deno.rename(
        outputPath,
        outputPath.replace(publicUrl, hashedPublicUrl),
      );

      assets.set(publicUrl, hashedPublicUrl);
    }
  }

  /**
   * Write the asset-manifest.json to the build output
   */
  await writeJsonFile(
    context.paths.resolveBuildPath("asset-manifest.json"),
    Array.from(assets.entries()),
  );

  return assets;
}
