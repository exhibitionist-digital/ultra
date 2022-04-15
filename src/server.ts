import { LRU, readableStreamFromReader, serve } from "./deps.ts";
import assets from "./assets.ts";
import transform from "./transform.ts";
import render from "./render.ts";
import { jsxify, stripTrailingSlash, tsify, tsxify } from "./resolver.ts";
import { isDev, port } from "./env.ts";
import { APIHandler } from "./types.ts";
import { resolveConfig, resolveImportMap } from "./config.ts";

const memory = new LRU(500);

const cwd = Deno.cwd();
const sourceDirectory = Deno.env.get("source") || "src";
const vendorDirectory = Deno.env.get("vendor") || "x";
const root = Deno.env.get("root") || `http://localhost:${port}`;
const lang = Deno.env.get("lang") || "en";
const disableStreaming = Deno.env.get("disableStreaming") || 0;

const config = await resolveConfig();
const importMap = await resolveImportMap(config);

const server = () => {
  const serverStart = Math.ceil(+new Date() / 100);
  const listeners = new Set<WebSocket>();

  const handler = async (request: Request) => {
    const requestStart = Math.ceil(+new Date() / 100);
    const cacheBuster = isDev ? requestStart : serverStart;
    const { raw, transpile } = await assets(sourceDirectory);
    const vendor = await assets(`.ultra/${vendorDirectory}`);
    const requestUrl = new URL(request.url);

    // web socket listener
    if (isDev) {
      if (requestUrl.pathname == "/_ultra_socket") {
        const { socket, response } = Deno.upgradeWebSocket(request);
        listeners.add(socket);
        socket.onclose = () => {
          listeners.delete(socket);
        };
        return response;
      }
    }

    // vendor map
    // Remove the leading slash
    const requestPathname = requestUrl.pathname.replace(/^\/+/g, "");

    if (vendor.raw.has(requestPathname)) {
      const headers = {
        "content-type": "text/javascript",
        "cache-control":
          "public, max-age=604800, stale-while-revalidate=86400, stale-if-error=259200",
      };

      const file = await Deno.open(
        `./${requestPathname}`,
      );
      const body = readableStreamFromReader(file);

      return new Response(body, { headers });
    }

    // static assets
    if (raw.has(`${sourceDirectory}${requestUrl.pathname}`)) {
      const contentType = raw.get(`${sourceDirectory}${requestUrl.pathname}`);
      const headers = {
        "content-type": contentType,
      };

      const file = await Deno.open(
        `./${sourceDirectory}${requestUrl.pathname}`,
      );
      const body = readableStreamFromReader(file);

      return new Response(body, { headers });
    }

    const transpilation = async (file: string) => {
      const headers = {
        "content-type": "text/javascript",
      };

      let js = memory.get(requestUrl.pathname);

      if (!js) {
        const source = await Deno.readTextFile(`./${file}`);
        const t0 = performance.now();
        js = await transform({
          source,
          sourceUrl: requestUrl,
          importMap,
          root,
          cacheBuster,
        });
        const t1 = performance.now();
        console.log(
          `Transpile ${file.replace(source, "")} in ${(t1 - t0).toFixed(2)}ms`,
        );
        if (!isDev) memory.set(requestUrl.pathname, js);
      }

      //@ts-ignore any
      return new Response(js, { headers });
    };

    // API
    if (requestUrl.pathname.startsWith("/api")) {
      const importAPIRoute = async (pathname: string): Promise<APIHandler> => {
        let path = `${sourceDirectory}${pathname}`;
        if (raw.has(`${path}.js`)) {
          path = `file://${cwd}/${path}.js`;
        } else if (raw.has(`${path}.ts`)) {
          path = `file://${cwd}/${path}.ts`;
        } else if (raw.has(`${path}/index.js`)) {
          path = `file://${cwd}/${path}/index.js`;
        } else if (raw.has(`${path}/index.ts`)) {
          path = `file://${cwd}/${path}/index.ts`;
        }
        return (await import(path)).default;
      };
      try {
        const pathname = stripTrailingSlash(requestUrl.pathname);
        const handler = await importAPIRoute(pathname);
        const response = await handler(request);
        return response;
      } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", {
          status: 500,
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        });
      }
    }

    // jsx
    const jsx = `${sourceDirectory}${jsxify(requestUrl.pathname)}`;
    if (transpile.has(jsx)) {
      return await transpilation(jsx);
    }

    // tsx
    const tsx = `${sourceDirectory}${tsxify(requestUrl.pathname)}`;
    if (transpile.has(tsx)) {
      return await transpilation(tsx);
    }

    // ts
    const ts = `${sourceDirectory}${tsify(requestUrl.pathname)}`;
    if (transpile.has(ts)) {
      return await transpilation(ts);
    }

    return new Response(
      await render({
        url: requestUrl,
        root,
        importMap,
        lang,
        disableStreaming: !!disableStreaming,
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
        if (kind === "modify" || kind === "create") {
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
