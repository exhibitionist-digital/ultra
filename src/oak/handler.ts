import { LRU, readableStreamFromReader } from "../deps.ts";
import assets from "../assets.ts";
import transform from "../transform.ts";
import render from "../render.ts";
import { jsxify, tsxify } from "../resolver.ts";
import { isDev } from "../env.ts";

import { OakOptions } from "../types.ts";

const memory = new LRU(500);

const server = (
  {
    importMap,
    dir = "src",
    root = "http://localhost:8000",
    lang = "en",
    env,
    context,
  }: OakOptions,
) => {
  const serverStart = Math.ceil(+new Date() / 100);

  const handler = async (request: Request) => {
    const requestStart = Math.ceil(+new Date() / 100);
    const cacheBuster = isDev ? requestStart : serverStart;
    const { raw, transpile } = await assets(dir);
    const url = new URL(request.url);

    // static assets
    if (raw.has(`${dir}${url.pathname}`)) {
      const file = await Deno.open(`./${dir}${url.pathname}`);
      const body = readableStreamFromReader(file);
      context.response.body = body;
      return;
    }

    const transpilation = async (file: string) => {
      let js = memory.get(url.pathname);

      if (!js) {
        const source = await Deno.readTextFile(`./${file}`);
        const t0 = performance.now();
        js = await transform({
          source,
          importMap,
          root,
          cacheBuster,
          env,
        });
        const t1 = performance.now();
        console.log(`Transpile ${file.replace(dir, "")} in ${t1 - t0}ms`);
        if (!isDev) memory.set(url.pathname, js);
      }
      context.response.type = "text/javascript";
      // @ts-ignore add js type
      context.response.body = js;
      return;
    };

    // jsx
    const jsx = `${dir}${jsxify(url.pathname)}`;
    if (transpile.has(jsx)) {
      return await transpilation(jsx);
    }

    // tsx
    const tsx = `${dir}${tsxify(url.pathname)}`;
    if (transpile.has(tsx)) {
      return await transpilation(tsx);
    }

    context.response.type = "text/html";
    context.response.body = await render({
      url,
      root,
      importMap,
      lang,
    });
  };

  return handler(context.request);
};

export default server;
