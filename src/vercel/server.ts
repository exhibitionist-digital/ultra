// @ts-nocheck todo: add types

import staticFiles from "./../static.ts";
import transform from "./../transform.ts";
import render from "./../render.ts";

const deploy = async ({ root, importMap, base }) => {
  const { trans } = await staticFiles({ root });
  const handler = async ({ request }) => {
    const url = new URL(request.url);

    // jsx/tsx
    if (trans.has(`${root}${url.pathname}x`)) {
      const source = await Deno.readTextFile(
        `./${root}${url.pathname}x`,
      );
      const js = await transform({
        source,
        importmap: importMap,
        root: base,
      });

      return new Response(js, {
        headers: {
          "content-type": "text/javascript",
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
        },
      },
    );
  };
  return handler;
};

export default deploy;
