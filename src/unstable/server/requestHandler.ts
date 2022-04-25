import assets from "../../assets.ts";
import { LRU, readableStreamFromReader } from "../../deps.ts";
import {
  replaceFileExt,
  resolveFileUrl,
  stripTrailingSlash,
} from "../../resolver.ts";
import transform from "../../transform.ts";
import type { APIHandler } from "../../types.ts";
import type { CreateRequestHandlerOptions } from "../types.ts";
import { createRequestContextFactory } from "./requestContext.ts";

export function createRequestHandler(options: CreateRequestHandlerOptions) {
  const {
    render,
    createRequestContext: _createRequestContext,
    cwd,
    importMap,
    paths: { source: sourceDirectory, vendor: vendorDirectory },
    isDev,
  } = options;

  const createRequestContext = createRequestContextFactory(
    _createRequestContext,
  );

  const memory = new LRU(500);
  const serverStart = Math.ceil(+new Date() / 100);
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
          transformConfig: {
            react: {
              importSource: "react",
              runtime: "automatic",
            },
          },
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
      const apiPaths = new Map([...raw, ...transpile]);
      const importAPIRoute = async (pathname: string): Promise<APIHandler> => {
        let path = `${sourceDirectory}${pathname}`;
        if (apiPaths.has(`${path}.js`)) {
          path = `file://${cwd}/${path}.js`;
        } else if (apiPaths.has(`${path}.ts`)) {
          path = `file://${cwd}/${path}.ts`;
        } else if (apiPaths.has(`${path}/index.js`)) {
          path = `file://${cwd}/${path}/index.js`;
        } else if (apiPaths.has(`${path}/index.ts`)) {
          path = `file://${cwd}/${path}/index.ts`;
        }
        return (await import(`${path}?ts=${cacheBuster}`)).default;
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

    const requestContext = await createRequestContext(request);

    return render(requestContext);
  };
}
