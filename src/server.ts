import {
  createCache,
  extname,
  LRU,
  readableStreamFromReader,
  serve,
} from "./deps.ts";
import assets from "./assets.ts";
import transform from "./transform.ts";
import render from "./render.ts";
import preloader, { ultraloader } from "./preloader.ts";
import { jsify, jsxify, tsxify } from "./resolver.ts";
import { isDev, port } from "./env.ts";

import { StartOptions } from "./types.ts";

const memory = new LRU(500);

const server = async (
  {
    importmap,
    dir = "src",
    root = "http://localhost:8000",
    lang = "en",
    env,
  }: StartOptions,
) => {
  const cache = createCache();
  const fileRootUri = `file://${Deno.cwd()}/${dir}`;
  const link = await ultraloader({ importmap, cache });
  const serverStart = Math.ceil(+new Date() / 100);
  const listeners = new Set<WebSocket>();

  const handler = async (request: Request) => {
    const requestStart = Math.ceil(+new Date() / 100);
    const cacheBuster = isDev ? requestStart : serverStart;
    const { raw, transpile } = await assets(dir);
    const url = new URL(request.url);

    // web socket listener
    if (isDev) {
      if (url.pathname == "/_ultra_socket") {
        const { socket, response } = Deno.upgradeWebSocket(request);
        listeners.add(socket);
        socket.onclose = () => {
          listeners.delete(socket);
        };
        return response;
      }
    }

    // static assets
    if (raw.has(`${dir}${url.pathname}`)) {
      const contentType = raw.get(`${dir}${url.pathname}`);
      const headers = {
        "content-type": contentType,
      };

      if (contentType === "application/javascript") {
        const link = await preloader(
          `${fileRootUri}${url.pathname}`,
          (specifier: string) => {
            const path = specifier.replace(fileRootUri, "");
            if (path !== url.pathname) {
              return `${url.origin}${path}`;
            }
          },
          cache,
        );

        if (link) {
          //@ts-ignore any
          headers.link = link;
        }
      }

      const file = await Deno.open(`./${dir}${url.pathname}`);
      const body = readableStreamFromReader(file);

      return new Response(body, { headers });
    }

    const transpilation = async (file: string) => {
      const headers = {
        "content-type": "application/javascript",
      };

      let js = memory.get(url.pathname);

      if (!js) {
        const source = await Deno.readTextFile(`./${file}`);
        const t0 = performance.now();
        js = await transform({
          source,
          importmap,
          root,
          cacheBuster,
          env,
        });
        const t1 = performance.now();
        console.log(`Transpile ${file.replace(dir, "")} in ${t1 - t0}ms`);
        if (!isDev) memory.set(url.pathname, js);
      }

      const link = await preloader(
        `${fileRootUri}${file.replace(dir, "")}`,
        (specifier: string) => {
          if (specifier.indexOf("http") == 0) return;
          const path = jsify(specifier.replace(fileRootUri, ""));
          if (extname(path) == ".ts") return;
          if (path !== url.pathname) {
            return `${url.origin}${path}?ts=${cacheBuster}`;
          }
        },
        cache,
      );

      if (link) {
        //@ts-ignore any
        headers.link = link;
      }

      //@ts-ignore any
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
        cacheBuster,
      }),
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
          link,
        },
      },
    );
  };

  // async file watcher to send socket messages
  if (isDev) {
    (async () => {
      for await (const { kind } of Deno.watchFs(dir, { recursive: true })) {
        if (kind === "modify") {
          for (const socket of listeners) {
            socket.send("reload");
          }
        }
      }
    })();
  }

  console.log(`Ultra running ${root}`);
  //@ts-ignore any
  return serve(handler, { port: +port });
};

export default server;
