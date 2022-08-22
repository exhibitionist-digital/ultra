import { copy, ensureDir, join, relative, walk } from "./deps.ts";

/**
 * Copies files from "src" to "dest", ignoring "dest" if it already exists
 */
export async function copySource(src: string, dest: string) {
  for await (const entry of walk(src, { skip: [new RegExp(dest)] })) {
    const relativePath = relative(src, entry.path);
    const outputPath = join(dest, relativePath);

    if (entry.isFile) {
      await copy(entry.path, outputPath);
    }

    if (entry.isDirectory) {
      await ensureDir(outputPath);
    }
  }
}
