// @ts-nocheck todo: add types

import { LRU, readableStreamFromReader, serve } from "./deps.ts";
import assets from "./assets.ts";
import transform from "./transform.ts";
import render from "./render.ts";
const memory = new LRU(1000);

const deploy = async ({ root, importMap, base }) => {
  const { raw, trans } = await assets({ root });

  const ultraGraph = await graph([
    importMap.imports["react"],
    importMap.imports["react-dom"],
    importMap.imports["wouter"],
    importMap.imports["swr"],
    importMap.imports["react-helmet"],
    importMap.imports["ultra/cache"],
  ]);

  const handler = async (request) => {
    const url = new URL(request.url);

    // static files
    if (raw.has(`${root}${url.pathname}`)) {
      const file = await Deno.open(`./${root}${url.pathname}`);
      const body = readableStreamFromReader(file);
      const { headers } = raw.get(`${root}${url.pathname}`);
      return new Response(body, { headers });
    }
    // jsx/tsx
    const path = `${root}${url.pathname}x`;
    if (trans.has(path)) {
      let js = memory.get(url.pathname);
      if (!js) {
        const source = await Deno.readTextFile("./" + path);
        js = await transform({
          source,
          importmap: importMap,
          root: base,
        });
        memory.set(url.pathname, js);
      }

      const { headers } = trans.get(path);

      return new Response(js, { headers });
    }

    return new Response(
      await render({
        url,
        root: base,
        importmap: importMap,
        lang: "en",
      }),
      {
        headers: {
          "content-type": "text/html",
          link: ultraGraph,
        },
      },
    );
  };
  console.log("Listening on http://localhost:8000");
  return serve(handler);
};

export default deploy;
