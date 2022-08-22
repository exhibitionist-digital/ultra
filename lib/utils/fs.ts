import { fromFileUrl } from "../deps.ts";

export async function exists(path: string): Promise<boolean> {
  path = path.startsWith("file://") ? fromFileUrl(path) : path;
  try {
    await Deno.stat(path);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }
}
