import { LRU, readableStreamFromReader } from "../deps.ts";
import assets from "../assets.ts";
import transform from "../transform.ts";
import render from "../render.ts";
import { jsxify, tsify, tsxify } from "../resolver.ts";
import { isDev } from "../env.ts";

import { OakOptions } from "../types.ts";

const memory = new LRU(500);

const sourceDirectory = Deno.env.get("source") || "src";
const vendorDirectory = Deno.env.get("vendor") || "x";
const configPath = Deno.env.get("config") || "./deno.json";
const root = Deno.env.get("root") || "http://localhost:8000";
const lang = Deno.env.get("lang") || "en";

const config = JSON.parse(Deno.readTextFileSync(configPath));
const importMap = JSON.parse(Deno.readTextFileSync(config?.importMap));

const server = (
  {
    env,
    context,
  }: OakOptions,
) => {
  const serverStart = Math.ceil(+new Date() / 100);

  const handler = async (request: Request) => {
    const requestStart = Math.ceil(+new Date() / 100);
    const cacheBuster = isDev ? requestStart : serverStart;
    const { raw, transpile } = await assets(sourceDirectory);
    const x = await assets(`.ultra/${vendorDirectory}`);
    const url = new URL(request.url);

    // vendor map
    if (x.raw.has(`.ultra${url.pathname}`)) {
      const file = await Deno.open(
        `./.ultra${url.pathname}`,
      );
      const body = readableStreamFromReader(file);
      context.response.body = body;
      return;
    }

    // static assets
    if (raw.has(`${sourceDirectory}${url.pathname}`)) {
      const file = await Deno.open(`./${sourceDirectory}${url.pathname}`);
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
        console.log(
          `Transpile ${file.replace(sourceDirectory, "")} in ${t1 - t0}ms`,
        );
        if (!isDev) memory.set(url.pathname, js);
      }
      context.response.type = "text/javascript";
      // @ts-ignore add js type
      context.response.body = js;
      return;
    };

    // jsx
    const jsx = `${sourceDirectory}${jsxify(url.pathname)}`;
    if (transpile.has(jsx)) {
      return await transpilation(jsx);
    }

    // tsx
    const tsx = `${sourceDirectory}${tsxify(url.pathname)}`;
    if (transpile.has(tsx)) {
      return await transpilation(tsx);
    }

    // ts
    const ts = `${sourceDirectory}${tsify(url.pathname)}`;
    if (transpile.has(ts)) {
      return await transpilation(ts);
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
