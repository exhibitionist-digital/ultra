import assets from "./../assets.ts";
import { readableStreamFromReader, serve } from "./../deps.ts";
import render from "./../render.ts";

import { StartOptions } from "../types.ts";

const transpiled = ".ultra";

const deploy = async (
  { importmap, dir = "src", root = "http://localhost:8000", lang = "en" }:
    StartOptions,
) => {
  const { raw } = await assets(dir);

  const trans = await assets(`${transpiled}/${dir}`);

  const handler = async (request: Request) => {
    const url = new URL(request.url);

    // static files
    if (raw.has(`${dir}${url.pathname}`)) {
      const file = await Deno.open(`./${dir}${url.pathname}`);
      const body = readableStreamFromReader(file);
      return new Response(body, {
        headers: {
          "content-type": raw.get(`${dir}${url.pathname}`),
        },
      });
    }
    // jsx/tsx
    if (trans.raw.has(`${transpiled}/${dir}${url.pathname}`)) {
      const file = await Deno.open(`./${transpiled}/${dir}${url.pathname}`);
      const body = readableStreamFromReader(file);
      return new Response(body, {
        headers: {
          "content-type": "application/javascript",
        },
      });
    }

    let link = await Deno.readTextFile(`./${transpiled}/graph.json`);
    link = JSON.parse(link);
    return new Response(
      await render({
        url,
        root,
        importmap,
        lang,
        bufferSize: 0,
      }),
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
          link,
        },
      },
    );
  };
  return serve(handler);
};

export default deploy;
