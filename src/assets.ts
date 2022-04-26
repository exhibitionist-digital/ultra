import { ensureDir, extname, mime, walk } from "./deps.ts";
import RouteHandler from "./routeHandler.ts";

const assets = async (dir: string) => {
  const meta = {
    apiRoutes: RouteHandler,
    raw: new Map(),
    transpile: new Map(),
  };
  await ensureDir(dir);

  for await (const file of walk(`./${dir}`)) {
    if (file.isFile) {
      let contentType = mime.lookup(extname(file.path));

      if (extname(file.path) == ".tsx") contentType = "text/jsx";
      if (extname(file.path) == ".ts") contentType = "text/ts";

      if (contentType) {
        const transpile = (contentType == "text/jsx" ||
          contentType == "text/tsx" || contentType == "text/ts");
        const isScript = transpile ||
          contentType === "text/javascript";

        meta[transpile ? "transpile" : "raw"].set(
          file.path,
          isScript ? "text/javascript" : contentType,
        );

        if (
          file.path.includes("/api/") &&
          [".js", ".ts"].includes(extname(file.path))
        ) {
          meta.apiRoutes.addHandler(file.path);
        }
      }
    }
  }

  // Set api root for route lookups
  meta.apiRoutes.setRoot("/src");

  return meta;
};

export default assets;
