import transform from "../../transform.ts";
import { Assets, ImportMap, Middleware } from "../../types.ts";
import { LRU } from "../../deps.ts";
import { createURL } from "../request.ts";
import { isDev, sourceDirectory } from "../../env.ts";
import {
  replaceFileExt,
  resolveFileUrl,
  ValidExtensions,
} from "../../resolver.ts";

const cwd = Deno.cwd();

export default function transpileSource(
  rawAssets: Assets,
  importMap: ImportMap,
): Middleware {
  const memory = new LRU<string>(500);

  return async (context, next) => {
    const url = createURL(context.request);

    const transpilation = async (file: string) => {
      let js = memory.get(url.pathname);

      if (!js) {
        const source = await Deno.readTextFile(resolveFileUrl(cwd, file));
        const t0 = performance.now();

        js = await transform({
          source,
          sourceUrl: url,
          importMap,
        });

        const t1 = performance.now();
        const duration = (t1 - t0).toFixed(2);

        console.log(`Transpile ${file} in ${duration}ms`);

        if (!isDev) {
          memory.set(url.pathname, js);
        }
      }

      return js;
    };

    const fileTypes: ValidExtensions[] = [".jsx", ".tsx", ".ts"];
    for (const fileType of fileTypes) {
      const filePath = `${sourceDirectory}${
        replaceFileExt(url.pathname, fileType)
      }`;
      if (rawAssets.transpile.has(filePath)) {
        context.response.body = await transpilation(filePath);
        context.response.headers = {
          ...context.response.headers,
          "content-type": "application/javascript",
        };
        await next(true);
        return;
      }
    }

    await next();
  };
}
