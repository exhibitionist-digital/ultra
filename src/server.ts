import { LRU, readableStreamFromReader, serve } from "./deps.ts";
import assets from "./assets.ts";
import transform from "./transform.ts";
import render from "./render.ts";
import { jsxify, tsify, tsxify } from "./resolver.ts";
import { isDev, port } from "./env.ts";

import { APIHandler, StartOptions } from "./types.ts";

const memory = new LRU(500);

const sourceDirectory = Deno.env.get("source") || "src";
const vendorDirectory = Deno.env.get("vendor") || "x";
const configPath = Deno.env.get("config") || "./deno.json";
const root = Deno.env.get("root") || `http://localhost:${port}`;
const lang = Deno.env.get("lang") || "en";

const config = JSON.parse(Deno.readTextFileSync(configPath));
const importMap = JSON.parse(Deno.readTextFileSync(config?.importMap));

const server = (options: StartOptions) => {
  const serverStart = Math.ceil(+new Date() / 100);
  const listeners = new Set<WebSocket>();
  if (!options) options = {};
  const { disableStreaming } = options;

  const handler = async (request: Request) => {
    const requestStart = Math.ceil(+new Date() / 100);
    const cacheBuster = isDev ? requestStart : serverStart;
    const { raw, transpile } = await assets(sourceDirectory);
    const x = await assets(`.ultra/${vendorDirectory}`);
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

    // vendor map
    if (x.raw.has(`.ultra${url.pathname}`)) {
      const headers = {
        "content-type": "text/javascript",
      };

      const file = await Deno.open(
        `./.ultra${url.pathname}`,
      );
      const body = readableStreamFromReader(file);

      return new Response(body, { headers });
    }

    // static assets
    if (raw.has(`${sourceDirectory}${url.pathname}`)) {
      const contentType = raw.get(`${sourceDirectory}${url.pathname}`);
      const headers = {
        "content-type": contentType,
      };

      const file = await Deno.open(`./${sourceDirectory}${url.pathname}`);
      const body = readableStreamFromReader(file);

      return new Response(body, { headers });
    }

    const transpilation = async (file: string) => {
      const headers = {
        "content-type": "text/javascript",
      };

      let js = memory.get(url.pathname);

      if (!js) {
        const source = await Deno.readTextFile(`./${file}`);
        const t0 = performance.now();
        js = await transform({
          source,
          importMap,
          root,
          cacheBuster,
        });
        const t1 = performance.now();
        console.log(
          `Transpile ${file.replace(source, "")} in ${(t1 - t0).toFixed(2)}ms`,
        );
        if (!isDev) memory.set(url.pathname, js);
      }

      //@ts-ignore any
      return new Response(js, { headers });
    };

    // API
    if (url.pathname.startsWith("/api")) {
      const importAPIRoute = async (pathname: string): Promise<APIHandler> => {
        let path = `${sourceDirectory}${pathname}`;
        if (raw.has(`${path}.js`)) {
          path = `file://${Deno.cwd()}/${path}.js`;
        } else if (raw.has(`${path}.ts`)) {
          path = `file://${Deno.cwd()}/${path}.ts`;
        } else if (raw.has(`${path}/index.js`)) {
          path = `file://${Deno.cwd()}/${path}/index.js`;
        } else if (raw.has(`${path}/index.ts`)) {
          path = `file://${Deno.cwd()}/${path}/index.ts`;
        }
        return (await import(path)).default;
      };
      const pathname = url.pathname.endsWith("/")
        ? url.pathname.slice(0, -1)
        : url.pathname;
      try {
        return await (await importAPIRoute(pathname))(request);
      } catch (_error) {
        return new Response(`Not found`, { status: 404 });
      }
    }

    // jsx
    const jsx = `${sourceDirectory}${jsxify(url.pathname)}`;
    if (transpile.has(jsx)) {
      return await transpilation(jsx);
    }

    // tsx
    const tsx = `${sourceDirectory}${tsxify(url.pathname)}`;
    if (transpile.has(tsx)) {
      return await transpilation(tsx);
    }

    // ts
    const ts = `${sourceDirectory}${tsify(url.pathname)}`;
    if (transpile.has(ts)) {
      return await transpilation(ts);
    }

    return new Response(
      await render({
        url,
        root,
        importMap,
        lang,
        disableStreaming,
      }),
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      },
    );
  };

  // async file watcher to send socket messages
  if (isDev) {
    (async () => {
      for await (
        const { kind } of Deno.watchFs(sourceDirectory, { recursive: true })
      ) {
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
