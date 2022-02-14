import { extname, mime, walk } from "./deps.ts";

const assets = async (dir: string) => {
  const meta = {
    raw: new Map(),
    transpile: new Map(),
  };

  for await (const file of walk(`./${dir}`)) {
    if (file.isFile) {
      let contentType = mime.lookup(extname(file.path));
      if (extname(file.path) == ".tsx") contentType = "text/jsx";

      if (contentType) {
        const transpile = (contentType == "text/jsx" ||
          contentType == "text/tsx");
        const isScript = transpile ||
          contentType === "application/javascript";

        meta[transpile ? "transpile" : "raw"].set(
          file.path,
          isScript ? "application/javascript" : contentType,
        );
      }
    }
  }

  return meta;
};

export default assets;
