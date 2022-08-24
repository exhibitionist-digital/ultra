import { copy, ensureDir, join, relative, walk } from "../deps.ts";

/**
 * @param from The directory of files to copy from
 * @param to The directory to copy files to
 */
export async function copyFiles(from: string, to: string, skip: RegExp[] = []) {
  const copied = new Map<string, string>();
  for await (
    const entry of walk(from, {
      skip: [new RegExp(to), ...skip],
    })
  ) {
    const relativePath = relative(from, entry.path);
    const outputPath = join(to, relativePath);

    if (entry.isFile) {
      await copy(entry.path, outputPath);
      copied.set(entry.path, outputPath);
    }

    if (entry.isDirectory) {
      await ensureDir(outputPath);
    }
  }

  return copied;
}
