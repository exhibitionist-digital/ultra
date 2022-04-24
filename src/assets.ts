import { ensureDir, extname, mime, walk } from "./deps.ts";

const assets = async (directories) => {
  const meta = {
    raw: new Map(),
    transpile: new Map(),
  };

  await Promise.all(directories.map(async (dir: string) => {
    console.log("checking", dir);

    await ensureDir(dir);

    for await (const file of walk(`./${dir}`)) {
      if (file.isFile) {
        let contentType = mime.lookup(extname(file.path));

        if (extname(file.path) == ".tsx") contentType = "text/jsx";
        if (extname(file.path) == ".ts") contentType = "text/ts";

        if (contentType) {
          const transpile = [
            "text/jsx",
            "text/tsx",
            "text/ts",
            "application/javascript",
          ].includes(contentType);

          meta[transpile ? "transpile" : "raw"].set(
            file.path,
            contentType,
          );
        }
      }
    }
  }));

  return meta;
};

export default assets;
