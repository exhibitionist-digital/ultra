import type { BuildContext } from "./types.ts";
import { copyFiles } from "./utils/fs.ts";

/**
 * Copies files from "src" to "dest", ignoring "dest" if it already exists
 */
export async function copySource(context: BuildContext) {
  const { rootDir, outputDir } = context.paths;
  const copied = await copyFiles(rootDir, outputDir, context.paths.excluded);

  for (const [source, dest] of copied.entries()) {
    context.files.set(source, dest);
  }
}
