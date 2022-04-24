import assets from "../assets.ts";
import {
  join,
  LRU,
  readableStreamFromReader,
  resolve,
  toFileUrl,
} from "../deps.ts";
import { disableStreaming, lang, root } from "../env.ts";
import render from "../render.ts";
import {
  replaceFileExt,
  resolveFileUrl,
  stripTrailingSlash,
} from "../resolver.ts";
import transform from "../transform.ts";
import type { APIHandler, ImportMap } from "../types.ts";
import { preloader } from "../preloader.ts";

type CreateRequestHandlerOptions = {
  cwd: string;
  importMap: ImportMap;
  paths: {
    source: string;
    vendor: string;
  };
  isDev?: boolean;
};

// TODO: Remove.
const enableLinkPreloadHeaders = true;

export async function createRequestHandler(
  options: CreateRequestHandlerOptions,
) {
  const {
    cwd,
    importMap,
    paths: { source: sourceDirectory, vendor: vendorDirectory },
    isDev,
  } = options;

  const memory = new LRU(500);
  const serverStart = Math.ceil(+new Date() / 100);
  const listeners = new Set<WebSocket>();

  const { raw, transpile } = await assets([
    sourceDirectory,
    join(".ultra", vendorDirectory),
  ]);

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
    const requestUrl = new URL(request.url);
    const fileSrcRootUri = toFileUrl(resolve(cwd, sourceDirectory)).toString();

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
        "content-type": "application/javascript",
      };

      let js = memory.get(requestUrl.pathname);

      if (!js) {
        const source = await Deno.readTextFile(resolveFileUrl(cwd, file));
        const t0 = performance.now();

        js = await transform({
          source,
          sourceUrl: requestUrl,
          importMap,
          cacheBuster,
        });

        const t1 = performance.now();
        const duration = (t1 - t0).toFixed(2);

        console.log(`Transpile ${file} in ${duration}ms`);

        if (!isDev) memory.set(requestUrl.pathname, js);
      }

      if (enableLinkPreloadHeaders) {
        const link = await preloader(
          resolveFileUrl(cwd, file).toString(),
          cacheBuster,
          (specifier: string) => {
            const path = specifier.replace(fileSrcRootUri, "");
            if (replaceFileExt(path, ".js") !== requestUrl.pathname) {
              return requestUrl.origin + path;
            }
          },
        );

        if (link) {
          headers.link = link;
        }
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

    // js
    const js = requestUrl.pathname.startsWith("/" + vendorDirectory)
      // vendored?
      ? join(
        ".ultra",
        requestUrl.pathname,
      )
      : sourceDirectory + requestUrl.pathname;

    if (transpile.has(js)) {
      return await transpilation(js);
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
