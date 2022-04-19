import { Context } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { extname, LRU, mime, readableStreamFromReader } from "../deps.ts";
import assets from "../assets.ts";
import transform from "../transform.ts";
import render from "../render.ts";
import { jsxify, tsify, tsxify } from "../resolver.ts";
import { isDev, lang, root, sourceDirectory, vendorDirectory } from "../env.ts";
import { resolveConfig, resolveImportMap } from "../config.ts";

const memory = new LRU(500);
const cwd = Deno.cwd();

const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);
const serverStart = Math.ceil(+new Date() / 100);

export async function ultraHandler(context: Context) {
  const requestStart = Math.ceil(+new Date() / 100);
  const cacheBuster = isDev ? requestStart : serverStart;
  const { raw, transpile } = await assets(sourceDirectory);
  const x = await assets(`.ultra/${vendorDirectory}`);
  const requestUrl = context.request.url;

  // vendor map
  if (x.raw.has(`.ultra${requestUrl.pathname}`)) {
    const file = await Deno.open(
      `./.ultra${requestUrl.pathname}`,
    );
    const body = readableStreamFromReader(file);
    context.response.body = body;
    return;
  }

  // static assets
  if (raw.has(`${sourceDirectory}${requestUrl.pathname}`)) {
    const file = await Deno.open(
      `./${sourceDirectory}${requestUrl.pathname}`,
    );
    const contentType = mime.lookup(extname(requestUrl.pathname));
    const body = readableStreamFromReader(file);
    context.response.type = contentType || "application/octet-stream";
    context.response.body = body;
    return;
  }

  const transpilation = async (file: string) => {
    let js = memory.get(requestUrl.pathname);

    if (!js) {
      const source = await Deno.readTextFile(`./${file}`);
      const t0 = performance.now();
      js = await transform({
        source,
        sourceUrl: requestUrl,
        importMap,
        cacheBuster,
      });
      const t1 = performance.now();
      console.log(
        `Transpile ${file.replace(sourceDirectory, "")} in ${t1 - t0}ms`,
      );
      if (!isDev) memory.set(requestUrl.pathname, js);
    }
    context.response.type = "text/javascript";
    // @ts-ignore add js type
    context.response.body = js;
    return;
  };

  // jsx
  const jsx = `${sourceDirectory}${jsxify(requestUrl.pathname)}`;
  if (transpile.has(jsx)) {
    return await transpilation(jsx);
  }

  // tsx
  const tsx = `${sourceDirectory}${tsxify(requestUrl.pathname)}`;
  if (transpile.has(tsx)) {
    return await transpilation(tsx);
  }

  // ts
  const ts = `${sourceDirectory}${tsify(requestUrl.pathname)}`;
  if (transpile.has(ts)) {
    return await transpilation(ts);
  }

  context.response.type = "text/html";
  context.response.body = await render({
    url: requestUrl,
    root,
    importMap,
    lang,
  });
}
