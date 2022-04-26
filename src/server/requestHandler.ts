import assets from "../assets.ts";
import { LRU, readableStreamFromReader } from "../deps.ts";
import { disableStreaming, lang, root } from "../env.ts";
import render from "../render.ts";
import {
  cacheBuster,
  replaceFileExt,
  resolveFileUrl,
  stripTrailingSlash,
} from "../resolver.ts";
import transform from "../transform.ts";
import type { APIHandler, ImportMap } from "../types.ts";

type CreateRequestHandlerOptions = {
  cwd: string;
  importMap: ImportMap;
  paths: {
    source: string;
    vendor: string;
  };
  isDev?: boolean;
};

export function createRequestHandler(options: CreateRequestHandlerOptions) {
  const {
    cwd,
    importMap,
    paths: { source: sourceDirectory, vendor: vendorDirectory },
    isDev,
  } = options;

  const memory = new LRU(500);
  const listeners = new Set<WebSocket>();

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

  return async function requestHandler(request: Request): Promise<Response> {
    const { apiRoutes, raw, transpile } = await assets(sourceDirectory);
    const vendor = await assets(`.ultra/${vendorDirectory}`);
    const requestUrl = new URL(request.url);

    // Set api root for route lookups
    apiRoutes.setRoot("/src");

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
    if (vendor.raw.has(".ultra" + requestUrl.pathname)) {
      const headers = {
        "content-type": "text/javascript",
      };

      const file = await Deno.open(
        `./.ultra${requestUrl.pathname}`,
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
        const source = await Deno.readTextFile(resolveFileUrl(cwd, file));
        const t0 = performance.now();

        js = await transform({
          source,
          sourceUrl: requestUrl,
          importMap,
        });

        const t1 = performance.now();
        const duration = (t1 - t0).toFixed(2);

        console.log(`Transpile ${file} in ${duration}ms`);

        if (!isDev) memory.set(requestUrl.pathname, js);
      }

      //@ts-ignore any
      return new Response(js, { headers });
    };

    // API
    if (requestUrl.pathname.startsWith("/api")) {
      const importAPIRoute = async (pathname: string): Promise<APIHandler> => {
        const path = `file://${cwd}/${pathname}`;
        return (await import(cacheBuster(new URL(path)))).default;
      };

      try {
        const pathname = stripTrailingSlash(requestUrl.pathname);
        const routeHandler = apiRoutes.getHandler(pathname);
        const handler = await importAPIRoute(routeHandler.path);
        const response = await handler(request, routeHandler.params);
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
    const jsx = `${sourceDirectory}${
      replaceFileExt(requestUrl.pathname, ".jsx")
    }`;
    if (transpile.has(jsx)) {
      return await transpilation(jsx);
    }

    // tsx
    const tsx = `${sourceDirectory}${
      replaceFileExt(requestUrl.pathname, ".tsx")
    }`;
    if (transpile.has(tsx)) {
      return await transpilation(tsx);
    }

    // ts
    const ts = `${sourceDirectory}${
      replaceFileExt(requestUrl.pathname, ".ts")
    }`;
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
}
