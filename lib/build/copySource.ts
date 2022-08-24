import { BuildContext } from "./types.ts";
import { copy, ensureDir, join, relative, walk } from "./deps.ts";

/**
 * Copies files from "src" to "dest", ignoring "dest" if it already exists
 */
export async function copySource(context: BuildContext) {
  const { rootDir, outputDir } = context.paths;
  for await (
    const entry of walk(rootDir, {
      skip: [new RegExp(outputDir)],
    })
  ) {
    const relativePath = relative(rootDir, entry.path);
    const outputPath = join(outputDir, relativePath);

    if (entry.isFile) {
      await copy(entry.path, outputPath);
      context.files.set(entry.path, outputPath);
    }

    if (entry.isDirectory) {
      await ensureDir(outputPath);
    }
  }
}
