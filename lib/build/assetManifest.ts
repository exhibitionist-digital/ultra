import { hash } from "../utils/hash.ts";
import { writeJsonFile } from "../utils/json.ts";
import { globToRegExp, join } from "./deps.ts";
import type { BuildContext } from "./types.ts";
import { addFileContentHash } from "./utils/path.ts";

type CreateAssetManifestOptions = {
  exclude?: string[];
};

export async function createAssetManifest(
  context: BuildContext,
  options?: CreateAssetManifestOptions,
) {
  const PUBLIC_ASSET_REGEX = globToRegExp(
    join(context.paths.outputDir, "public", "**", "*"),
    {
      extended: true,
      globstar: true,
      caseInsensitive: false,
    },
  );

  const excluded = options?.exclude?.map((exclude) =>
    globToRegExp(
      join(context.paths.outputDir, "public", exclude),
      {
        extended: true,
        globstar: true,
        caseInsensitive: false,
      },
    )
  ) || [];

  function isExcluded(path: string) {
    return excluded.some((pattern) => pattern.test(path));
  }

  const publicDir = context.paths.resolveBuildPath("public");
  const assets = new Map<string, string>();

  for (const [source, outputPath] of context.files.entries()) {
    if (
      !isExcluded(outputPath) &&
      PUBLIC_ASSET_REGEX.test(outputPath)
    ) {
      const content = await Deno.readFile(source);
      const sourceHash = await hash(content);

      /**
       * Strip publicDir from the path to get the absolute
       * url to the asset.
       */
      const publicUrl = outputPath.replace(publicDir, "");
      const hashedPublicUrl = addFileContentHash(publicUrl, sourceHash);

      await Deno.copyFile(
        outputPath,
        outputPath.replace(publicUrl, hashedPublicUrl),
      );

      assets.set(publicUrl, hashedPublicUrl);

      /**
       * We change the output path of the source to
       * the new hashed version.
       */
      context.files.set(
        source,
        outputPath.replace(publicUrl, hashedPublicUrl),
      );
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
