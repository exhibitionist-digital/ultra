import { join } from "../deps.ts";
import { toLocalPathname } from "../utils.ts";
import type { RequestHandler } from "../types.ts";

class CachedString extends String {}

export function createCompileHandler(
  rootUrl: URL,
  pathPrefix: string,
) {
  const compileHandler: RequestHandler = async (context) => {
    const { app } = context;
    try {
      const pathname = toLocalPathname(context.pathname, pathPrefix);

      const url = pathname.startsWith("file://")
        ? new URL(pathname)
        : new URL(join(rootUrl.toString(), pathname));

      const key = url.toString();
      const input = await app.sources.get<string | CachedString>(key);

      if (!input) {
        throw new Error(`${url} is not valid compiler input.`);
      }

      let output: string | null = null;

      if (input instanceof CachedString) {
        console.log(`Cached: ${key}`);
        output = input.toString();
      } else {
        console.log(`Compiling: ${key}`);
        output = app.compiler.compile({
          input,
          url,
        });
        app.sources.set(key, new CachedString(output));
      }

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
