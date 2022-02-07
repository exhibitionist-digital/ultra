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
  const assetsMeta = await assets({ root });
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

  const graphApp = await createGraph(`${fileRootUri}/app.jsx`);
  const { modules: appModules } = graphApp.toJSON();

  for (const { specifier } of appModules) {
    if ([".js", ".jsx", ".ts", ".tsx"].includes(extname(specifier))) {
      const path = specifier.replace(fileRootUri, "");
      attributes.push(
        `<http://localhost:8000${path}>; rel="modulepreload"`,
      );
    }
  }

  const linkUltra = attributes.join(", ");

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
