import { createCompiler } from "../build/deps.ts";
import { ULTRA_COMPILER_PATH } from "../constants.ts";
import { extname, join, sprintf, toFileUrl } from "../deps.ts";
import { log } from "../logger.ts";
import type { CompilerOptions, Context, Next } from "../types.ts";

const { transform } = await createCompiler();

export const compiler = (options: CompilerOptions) => {
  const {
    root,
    jsxImportSource = "react",
  } = options;

  return async (context: Context, next: Next) => {
    const method = context.req.method;
    const requestPathname = decodeURIComponent(
      new URL(context.req.url).pathname,
    );

    const pathname = requestPathname.replace(`${ULTRA_COMPILER_PATH}/`, "");
    const isRemoteSource = pathname.startsWith("https://") ||
      pathname.startsWith("http://");

    const extension = extname(pathname);
    const path = !isRemoteSource ? join(root, pathname) : pathname;
    const url = !isRemoteSource ? toFileUrl(path) : new URL(pathname);

    const isCompilerTarget = [".ts", ".tsx", ".js", ".jsx"].includes(extension);

    if (method === "GET" && isCompilerTarget) {
      const bytes = await fetch(url).then((response) => response.arrayBuffer());
      let source = new TextDecoder().decode(bytes);

      if (options.hooks?.beforeTransform) {
        try {
          source = options.hooks.beforeTransform(source, {
            path,
            extension,
          });
        } catch (e) {
          log.error(e);
        }
        if (typeof source !== "string") {
          throw new Error("beforeTransform hook must return a string");
        }
      }

      log.debug(sprintf("Compiling: %s", url.toString()));

      try {
        let transpiled = await transform(
          url.pathname,
          source,
          jsxImportSource,
          true,
          false,
        );

        if (options.hooks?.afterTransform) {
          try {
            transpiled = options.hooks.afterTransform(transpiled, {
              path,
              extension,
            });
          } catch (e) {
            log.error(e);
          }
          if (typeof source !== "string") {
            throw new Error("afterTransform hook must return a string");
          }
        }

        return new Response(transpiled, {
          status: 200,
          headers: {
            "content-type": "text/javascript; charset=utf-8",
          },
        });
      } catch (error) {
        log.error(error);
      }
    }

    await next();
  };
};
