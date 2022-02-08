// @ts-nocheck todo: add types

import {
  createCache,
  createGraph,
  extname,
  LRU,
  readableStreamFromReader,
  serve,
} from "./deps.ts";
import assets from "./assets.ts";
import transform from "./transform.ts";
import render from "./render.ts";
const memory = new LRU(1000);

const cache = createCache();
const { cacheInfo, load } = cache;

const deploy = async ({ root, importMap, base }) => {
  const { raw, transpile } = await assets({ root });
  const fileRootUri = `file://${Deno.cwd()}/${root}`;

  const graph = await createGraph([
    importMap.imports["react"],
    importMap.imports["react-dom"],
    importMap.imports["wouter"],
    importMap.imports["swr"],
    importMap.imports["react-helmet"],
    importMap.imports["ultra/cache"],
  ], {
    cacheInfo,
    load,
  });

  const { modules } = graph.toJSON();
  const attributes = [];

  for (const { specifier } of modules) {
    if (extname(specifier) === ".js") {
      attributes.push(`<${specifier}>; rel="modulepreload"`);
    }
  }

  const link = attributes.join(", ");

  const handler = async (request) => {
    const url = new URL(request.url);

    // static
    if (raw.has(`${root}${url.pathname}`)) {
      const contentType = raw.get(`${root}${url.pathname}`);
      const headers = {
        "content-type": contentType,
      };

      if (contentType === "application/javascript") {
        const graph = await createGraph(`${fileRootUri}${url.pathname}`);

        const { modules } = graph.toJSON();
        const attributes = [];

        for (const { specifier } of modules) {
          const path = specifier.replace(fileRootUri, "");
          if (path !== url.pathname) {
            attributes.push(`<${url.origin}${path}>; rel="modulepreload"`);
          }
        }

        if (attributes.length > 0) {
          headers.link = attributes.join(", ");
        }
      }

      const file = await Deno.open(`./${root}${url.pathname}`);
      const body = readableStreamFromReader(file);

      return new Response(body, { headers });
    }

    // transpile
    if (transpile.has(`${root}${url.pathname}x`)) {
      const headers = {
        "content-type": "application/javascript",
      };

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

      const graph = await createGraph(`${fileRootUri}${url.pathname}x`);

      const { modules } = graph.toJSON();
      const attributes = [];

      for (const { specifier } of modules) {
        const path = specifier.replace(fileRootUri, "");
        if (path !== `${url.pathname}x`) {
          attributes.push(`<${url.origin}${path}>; rel="modulepreload"`);
        }
      }

      if (attributes.length > 0) {
        headers.link = attributes.join(", ");
      }

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
          link,
        },
      },
    );
  };

  console.log("Listening on http://localhost:8000");

  return serve(handler);
};

export default deploy;
