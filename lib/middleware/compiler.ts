import { transformSource } from "../compiler/transform.ts";
import { ULTRA_COMPILER_PATH } from "../constants.ts";
import { encode, extname, join, sprintf, toFileUrl } from "../deps.ts";
import { log } from "../logger.ts";
import type { CompilerOptions, Context, Next } from "../types.ts";

export const compiler = (options: CompilerOptions) => {
  const {
    root,
    target,
    useBuiltins,
    externalHelpers,
    dynamicImport,
    jsxImportSource,
    runtime,
  } = options;

  return async (context: Context, next: Next) => {
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
        const transformed = await transformSource(source, {
          filename: url.pathname,
          target,
          externalHelpers,
          useBuiltins,
          dynamicImport,
          jsxImportSource,
          runtime,
          development: true,
          sourceMaps: true,
          minify: false,
        });

        let { code, map } = transformed;

        if (options.hooks?.afterTransform) {
          try {
            code = options.hooks.afterTransform(code, {
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

        if (map) {
          code = insertSourceMap(code, map, url);
        }

        return new Response(code, {
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

function insertSourceMap(code: string, map: string, sourceUrl: URL) {
  return `${code}\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,${
    encode(
      map,
    )
  }\n//# sourceURL=ultra://${sourceUrl.pathname}`;
}
