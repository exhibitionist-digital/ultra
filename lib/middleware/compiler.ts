import { transformSource } from "../compiler/transform.ts";
import { ULTRA_COMPILER_PATH } from "../constants.ts";
import { Context, encode, extname, join, Next, toFileUrl } from "../deps.ts";
import type { Mode, TransformSourceOptions } from "../types.ts";

export type CompilerOptions = {
  mode: Mode;
  root: string;
} & Omit<TransformSourceOptions, "minify" | "development">;

const decoder = new TextDecoder();

export const compiler = (options: CompilerOptions) => {
  const {
    root,
    target,
    useBuiltins,
    externalHelpers,
    dynamicImport,
    importSource,
    runtime,
  } = options;

  return async (context: Context, next: Next) => {
    const method = context.req.method;
    const requestPathname = new URL(context.req.url).pathname;
    const pathname = requestPathname.replace(
      `${ULTRA_COMPILER_PATH}/`,
      "",
    );

    const extension = extname(pathname);
    const path = join(root, pathname);
    const url = toFileUrl(path);

    const isCompilerTarget = [".ts", ".tsx", ".js", ".jsx"].includes(extension);

    if (method === "GET" && isCompilerTarget) {
      const bytes = await Deno.readFile(url);
      const source = decoder.decode(bytes);

      try {
        const transformed = await transformSource(source, {
          filename: url.pathname,
          target,
          externalHelpers,
          useBuiltins,
          dynamicImport,
          importSource,
          runtime,
          development: true,
          sourceMaps: true,
          minify: false,
        });

        let { code, map } = transformed;

        if (map) {
          code = insertSourceMap(code, map, url);
        }

        return context.body(code, 200, {
          "content-type": "text/javascript",
        });
      } catch (error) {
        console.error(error);
      }
    }

    await next();
  };
};

function insertSourceMap(code: string, map: string, sourceUrl: URL) {
  return `${code}\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,${
    encode(map)
  }\n//# sourceURL=ultra://${sourceUrl.pathname}`;
}
