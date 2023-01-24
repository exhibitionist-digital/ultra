import { createCompiler } from "https://deno.land/x/mesozoic@v1.3.1/mod.ts";
import { ULTRA_COMPILER_PATH } from "../constants.ts";
import { extname, join, sprintf, toFileUrl } from "../deps.ts";
import { log } from "../logger.ts";
import type { CompilerOptions, Context, Next } from "../types.ts";

export const compiler = (options: CompilerOptions) => {
  const {
    root,
    jsxImportSource = "react",
  } = options;

  return async (context: Context, next: Next) => {
    const { transform } = await createCompiler();

    const method = context.req.method;
    const requestPathname = new URL(context.req.url).pathname;
    const pathname = requestPathname.replace(`${ULTRA_COMPILER_PATH}/`, "");

    const extension = extname(pathname);
    const path = join(root, pathname);
    const url = toFileUrl(path);

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
