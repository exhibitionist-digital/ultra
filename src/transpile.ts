import { LRU } from "./deps.ts";
import { isDev } from "./env.ts";
import { resolveFileUrl } from "./resolver.ts";
import transform from "./transform.ts";
import { ImportMap } from "./types.ts";

export default async function transpile(
  file: string,
  url: URL,
  memory: LRU<string>,
  importMap: ImportMap,
) {
  let js = memory.get(url.pathname);

  if (!js) {
    const source = await Deno.readTextFile(
      resolveFileUrl(Deno.cwd(), file),
    );
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
}
