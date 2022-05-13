import { join } from "../deps.ts";
import { toLocalPathname } from "../utils.ts";
import { LinkHeader } from "../links.ts";
import type { RequestHandler } from "../deps.ts";
import { Application } from "../app.ts";

export function createCompileHandler(
  rootUrl: URL,
  pathPrefix: string,
) {
  const compileHandler: RequestHandler<Application> = async (
    { app, pathname },
  ) => {
    const sources = await app.resolveSources();

    try {
      pathname = toLocalPathname(pathname, pathPrefix);

      const url = new URL(join(rootUrl.toString(), pathname));
      const input = sources.get(url.toString());

      if (!input) {
        throw new Error(`${url} is not valid compiler input.`);
      }

      const output = app.compiler.compile({
        input,
        url,
      });

      const links = new LinkHeader();

      for (const preload of app.compiler.modules) {
        if (preload.host === "esm.sh" || preload.pathname.endsWith(".js")) {
          links.preloadModule(preload);
        }
      }

      return new Response(output, {
        headers: {
          "content-type": "application/javascript",
          "link": links.toString(),
        },
      });
    } catch (error) {
      console.error(error);
      return new Response("", {
        status: 404,
      });
    }
  };

  return compileHandler;
}
