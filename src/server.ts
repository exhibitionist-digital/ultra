// @ts-nocheck todo: add types

import { LRU, readableStreamFromReader, serve } from "./deps.ts";
import staticFiles from "./static.ts";
import transform from "./transform.ts";
import render from "./render.ts";
import graph from "./graph.ts";
const memory = new LRU(1000);

const deploy = async ({ root, importMap, base }) => {
  const { raw, trans } = await staticFiles({ root });

  const ultraGraph = await graph({ importMap });

  const handler = async (request) => {
    const url = new URL(request.url);

    // static files
    if (raw.has(`${root}${url.pathname}`)) {
      const file = await Deno.open(`./${root}${url.pathname}`);
      const body = readableStreamFromReader(file);
      return new Response(body);
    }
    // jsx/tsx
    if (trans.has(`${root}${url.pathname}x`)) {
      let js = memory.get(url.pathname);
      if (!js) {
        const source = await Deno.readTextFile(`./${root}${url.pathname}x`);
        js = await transform({
          source,
          importmap: importMap,
          root: base,
        });
        memory.set(url.pathname, js);
      }
      return new Response(js, {
        headers: {
          "content-type": "application/javascript",
        },
      });
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
          "link": ultraGraph.join(", "),
        },
      },
    );
  };
  console.log("Listening on http://localhost:8000");
  return serve(handler);
};

export default deploy;
