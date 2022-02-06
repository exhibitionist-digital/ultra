// @ts-nocheck todo: add types

import staticFiles from "./../static.ts";
import { readableStreamFromReader, serve } from "./../deps.ts";
import render from "./../render.ts";

const transpiled = ".ultra";

const deploy = async ({ root, importMap, base }) => {
  const { raw } = await staticFiles({ root });

  const trans = await staticFiles({ root: `${transpiled}/${root}` });

  const handler = async (request) => {
    const url = new URL(request.url);

    // static files
    if (raw.has(`${root}${url.pathname}`)) {
      const file = await Deno.open(`./${root}${url.pathname}`);
      const body = readableStreamFromReader(file);
      return new Response(body, {
        headers: {
          "content-type": raw.get(`${root}${url.pathname}`),
        },
      });
    }
    // jsx/tsx
    if (trans.raw.has(`${transpiled}/${root}${url.pathname}`)) {
      const file = await Deno.open(`./${transpiled}/${root}${url.pathname}`);
      const body = readableStreamFromReader(file);
      return new Response(body, {
        headers: {
          "content-type": "application/javascript",
        },
      });
    }

    let ultraGraph = await Deno.readTextFile(`./${transpiled}/graph.json`);
    ultraGraph = JSON.parse(ultraGraph);
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
  return serve(handler);
};

export default deploy;
