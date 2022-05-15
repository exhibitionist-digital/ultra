import { join } from "../deps.ts";
import { toLocalPathname } from "../utils.ts";
import type { RequestHandler } from "../types.ts";

export function createCompileHandler(
  rootUrl: URL,
  pathPrefix: string,
) {
  const compileHandler: RequestHandler = async (
    { app, pathname },
  ) => {
    try {
      pathname = toLocalPathname(pathname, pathPrefix);

      const url = pathname.startsWith("file://")
        ? new URL(pathname)
        : new URL(join(rootUrl.toString(), pathname));

      const input = await app.sources.get(url.toString());

      if (!input) {
        throw new Error(`${url} is not valid compiler input.`);
      }

      const output = app.compiler.compile({
        input,
        url,
      });

      return new Response(output, {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
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
