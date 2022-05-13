import { join, Router, serveDir } from "./deps.ts";
import type { RequestHandler } from "./deps.ts";
import type { CreateRouterOptions } from "./types.ts";
import { createCompileHandler } from "./handler/compile.ts";
import { Application } from "./app.ts";

export function createRouter(
  options: CreateRouterOptions,
) {
  const {
    renderHandler,
    rootUrl,
    publicPath,
    compilerPath,
  } = options;

  const publicUrl = join(rootUrl.pathname, publicPath);

  const compileHandler = createCompileHandler(
    rootUrl,
    compilerPath,
  );

  const publicHandler: RequestHandler<Application> = ({ request }) =>
    serveDir(request, { fsRoot: publicUrl, urlRoot: publicPath });

  const router = new Router<Application>();

  router.add("GET", `/${publicPath}/*`, publicHandler);
  router.add("GET", `${compilerPath}*.(tsx|ts|js|jsx).js`, compileHandler);
  router.add("GET", "/*", renderHandler);

  return router;
}
