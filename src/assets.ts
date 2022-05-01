import { Assets } from "./types.ts";
import { ensureDir, extname, join, mime, walk } from "./deps.ts";

export default async function assets(dir: string) {
  const meta: Assets = {
    raw: new Map(),
    transpile: new Map(),
  };
  await ensureDir(dir);

  for await (const file of walk(join(".", dir))) {
    if (file.isFile) {
      let contentType = mime.lookup(extname(file.path));

      if (extname(file.path) == ".tsx") contentType = "text/jsx";
      if (extname(file.path) == ".ts") contentType = "text/ts";

      if (contentType) {
        const transpile = [
          "text/jsx",
          "text/tsx",
          "text/ts",
        ].includes(contentType);

        meta[transpile ? "transpile" : "raw"].set(
          file.path.replaceAll("\\", "/"),
          contentType,
        );
      }
    }
  }

  return meta;
}
