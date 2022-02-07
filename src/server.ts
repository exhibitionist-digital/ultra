// @ts-nocheck todo: add types

import { createGraph, LRU, readableStreamFromReader, serve } from "./deps.ts";
import assets from "./assets.ts";
import transform from "./transform.ts";
import render from "./render.ts";
import modulepreloadArgs from "./modulepreload.ts";
const memory = new LRU(1000);

const deploy = async ({ root, importMap, base }) => {
  const assetsMeta = await assets({ root });

  const linkUltra = await modulepreloadArgs([
    importMap.imports["react"],
    importMap.imports["react-dom"],
    importMap.imports["wouter"],
    importMap.imports["swr"],
    importMap.imports["react-helmet"],
    importMap.imports["ultra/cache"],
  ]);

  const handler = async (request) => {
    const url = new URL(request.url);

    let body;
    const path = `${root}${url.pathname}`;
    const assetMeta = assetsMeta.get(path);

    if (assetMeta) {
      const headers = {
        "content-type": assetMeta["content-type"],
      };

      const relPath = "./" + path;

      if (assetMeta.isScript) {
        const fileRootUri = `file://${Deno.cwd()}/${root}`;
        const graph = await createGraph(`${fileRootUri}${url.pathname}`);

        const { modules } = graph.toJSON();
        const response = [];

        for (const { specifier } of modules) {
          const path = specifier.replace(fileRootUri, "");
          if (path !== url.pathname) {
            response.push(`<${url.origin}${path}>; rel="modulepreload"`);
          }
        }

        if (response.length > 0) {
          headers.link = response.join(", ");
        }

        if (assetMeta.transpile) {
          let js = memory.get(url.pathname);
          if (!js) {
            const source = await Deno.readTextFile(relPath);
            js = await transform({
              source,
              importmap: importMap,
              root: base,
            });
            memory.set(url.pathname, js);
          }

          body = js;
        }
      } else {
        const file = await Deno.open(relPath);
        body = readableStreamFromReader(file);
      }

      return new Response(body, { headers });
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
          link: linkUltra,
        },
      },
    );
  };

  console.log("Listening on http://localhost:8000");

  return serve(handler);
};

export default deploy;
