import { dirname, join } from "https://deno.land/std@0.176.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.176.0/fs/ensure_dir.ts";
import { confirm } from "./ask.ts";
import { Config } from "./config.ts";
import { gradient } from "./styling.ts";

export function fileExtension(config: Config) {
  return function (fileName: string, jsx: boolean) {
    if (config.ts) {
      if (jsx) return fileName + ".tsx";
      return fileName + ".ts";
    }
    if (jsx) {
      return fileName + ".jsx";
    }
    return fileName + ".js";
  };
}

export function createFile(config: Config) {
  return async function (fileName: string, content: string | Uint8Array) {
    const path = join(config.cwd, config.name, fileName);
    let overwritten = false;
    if (await exists(path)) {
      const confirmed = await confirm(
        gradient(
          `A file at "${path}" already exists, do you want to overwrite it?`,
          1,
        ),
      );
      if (!confirmed) {
        return Promise.resolve();
      }
      overwritten = true;
    }
    await ensureDir(dirname(path));

    await Deno.writeFile(
      path,
      typeof content === "string" ? new TextEncoder().encode(content) : content,
    );
    if (!overwritten) {
      console.log(`${gradient("✔️  Created:")} ${path}`);
    } else {
      console.log(`${gradient("✔️  Modifed:")} ${path}`);
    }
  };
}

export function fetchFile(config: Config) {
  return async function (path: string, url: string) {
    const create = createFile(config);
    const response = await fetch(url);
    const content = await response.arrayBuffer();
    console.log(`${gradient("✔️  Fetched:")} ${url}`);
    create(path, new Uint8Array(content));
  };
}

export async function exists(filePath: string): Promise<boolean> {
  try {
    await Deno.lstat(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
