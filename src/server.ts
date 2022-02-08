// @ts-nocheck todo: add types

import { extname, LRU, readableStreamFromReader, serve } from "./deps.ts";
import assets from "./assets.ts";
import transform from "./transform.ts";
import render from "./render.ts";
const memory = new LRU(1000);
import generateLinkHeader from "./link.ts";

const deploy = async ({ root, importMap, base }) => {
  const { raw, transpile } = await assets({ root });
  const fileRootUri = `file://${Deno.cwd()}/${root}`;

  const link = await generateLinkHeader([
    importMap.imports["react"],
    importMap.imports["react-dom"],
    importMap.imports["wouter"],
    importMap.imports["swr"],
    importMap.imports["react-helmet"],
    importMap.imports["ultra/cache"],
  ], (specifier) => {
    if (extname(specifier) !== ".js") {
      return specifier;
    }
  });

  const handler = async (request) => {
    const url = new URL(request.url);

    // static
    if (raw.has(`${root}${url.pathname}`)) {
      const contentType = raw.get(`${root}${url.pathname}`);
      const headers = {
        "content-type": contentType,
      };

      if (contentType === "application/javascript") {
        const link = await generateLinkHeader(
          `${fileRootUri}${url.pathname}`,
          (specifier) => {
            const path = specifier.replace(fileRootUri, "");
            if (path !== url.pathname) {
              return `${url.origin}${path}`;
            }
          },
        );

        if (link) {
          headers.link = link;
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

      const link = await generateLinkHeader(
        `${fileRootUri}${url.pathname}x`,
        (specifier) => {
          const path = specifier.replace(fileRootUri, "");
          if (path !== `${url.pathname}x`) {
            return `${url.origin}${path}`;
          }
        },
      );

      if (link) {
        headers.link = link;
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
