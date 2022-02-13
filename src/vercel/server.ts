// import { createCache } from "./deps.ts";
import assets from "./../assets.ts";
import transform from "./../transform.ts";
import render from "./_render.ts";
// import preloader, { ultraloader } from "./../preloader.ts";
import { jsxify, tsxify } from "./../resolver.ts";
// import { isDev } from "./../env.ts";

import { StartOptions, VercelStart } from "./../types.ts";

const server = (
  { importmap, dir = "src", root = "http://localhost:8000", lang = "en" }:
    StartOptions,
) => {
  // const cache = createCache({ root: "/tmp" });
  // const fileRootUri = `file://${Deno.cwd()}/${dir}`;
  // const link = await ultraloader({ importmap, cache });
  // const serverStart = +new Date();

  const handler = async ({ request }: VercelStart) => {
    // const requestStart = +new Date();
    const cacheBuster = -1;
    const { transpile } = await assets(dir);
    const url = new URL(request.url);

    const transpilation = async (file: string) => {
      const headers = {
        "content-type": "application/javascript",
      };

      const source = await Deno.readTextFile(`./${file}`);
      const t0 = performance.now();
      const js = await transform({
        source,
        importmap,
        root,
        cacheBuster,
      });
      const t1 = performance.now();
      console.log(`Transpile ${file.replace(dir, "")} in ${t1 - t0}ms`);

      // const link = await preloader(
      //   `${fileRootUri}${file.replace(dir, "")}`,
      //   (specifier) => {
      //     const path = jsify(specifier.replace(fileRootUri, ""));
      //     if (path !== url.pathname) {
      //       return `${url.origin}${path}`;
      //     }
      //   },
      //   cache,
      // );

      // if (link) {
      //   headers.link = link;
      // }

      return new Response(js, { headers });
    };

    // jsx
    const jsx = `${dir}${jsxify(url.pathname)}`;
    if (transpile.has(jsx)) {
      return await transpilation(jsx);
    }

    // tsx
    const tsx = `${dir}${tsxify(url.pathname)}`;
    if (transpile.has(tsx)) {
      return await transpilation(tsx);
    }

    return new Response(
      await render({
        url,
        root,
        importmap,
        lang,
      }),
      {
        headers: {
          "content-type": "text/html",
          // link,
        },
      },
    );
  };

  return handler;
};

export default server;
