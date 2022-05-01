import assets from "../assets.ts";
import { join, LRU, readableStreamFromReader } from "../deps.ts";
import { disableStreaming, lang } from "../env.ts";
import render from "../render.ts";
import {
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
  const [{ raw, transpile }, vendor] = await Promise.all([
    assets(sourceDirectory),
    assets(`.ultra/${vendorDirectory}`),
  ]);

  return async function requestHandler(request: Request): Promise<Response> {
    const requestUrl = new URL(request.url);

    const xForwardedProto = request.headers.get("x-forwarded-proto");
    if (xForwardedProto) requestUrl.protocol = xForwardedProto + ":";

    const xForwardedHost = request.headers.get("x-forwarded-host");
    if (xForwardedHost) requestUrl.hostname = xForwardedHost;

    // vendor map
    if (vendor.raw.has(".ultra" + requestUrl.pathname)) {
      const headers = {
        "content-type": "application/javascript",
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
        join(".", sourceDirectory, requestUrl.pathname),
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
