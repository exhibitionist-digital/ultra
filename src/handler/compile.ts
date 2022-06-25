import { debug, join } from "../deps.ts";
import { toLocalPathname } from "../utils.ts";
import type { RequestHandler } from "../types.ts";

class CachedString extends String {}

const log = debug("ultra:compiler");
const compilerCache = new Map<string, CachedString>();

function toAbsoluteUrl(pathname: string, rootUrl: URL) {
  return pathname.startsWith("file://") || pathname.startsWith("http")
    ? new URL(pathname)
    : new URL(join(rootUrl.toString(), pathname));
}

export function createCompileHandler(
  rootUrl: URL,
  pathPrefix: string,
) {
  const compileHandler: RequestHandler = async (context) => {
    const { app } = context;
    try {
      const pathname = toLocalPathname(context.pathname, pathPrefix);
      const url = toAbsoluteUrl(pathname, rootUrl);

      const sourceFile = await app.sourceFiles.get(url);

      if (!sourceFile) {
        throw new Error(`${url} is not a valid compiler source file.`);
      }

      let output: string | null = null;
      const cached = compilerCache.get(url.toString());

      if (cached) {
        log(`Cached: ${url}`);
        output = cached.toString();
      } else {
        log(`Compiling: ${url}`);

        output = app.compiler.compile({
          input: sourceFile.code,
          url,
        });

        compilerCache.set(url.toString(), new CachedString(output));
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
