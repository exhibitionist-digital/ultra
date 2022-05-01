import assets from "../assets.ts";
import type { Context, ImportMap, Middleware } from "../types.ts";
import { Handler, LRU } from "../deps.ts";
import { createResponse } from "./response.ts";
import { handleMiddleware } from "./middleware.ts";
import { lang } from "../env.ts";
import vendorMap from "./middleware/vendorMap.ts";
import staticAsset from "./middleware/staticAsset.ts";
import transpileSource from "./middleware/transpileSource.ts";
import handleRequest from "./middleware/handleRequest.ts";

export type CreateRequestHandlerOptions = {
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
): Promise<Handler> {
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

  // Use splice to keep the reference to the same array. Otherwise, server.use
  // won't work. These are in reverse order.
  middleware.splice(
    0,
    0,
    transpileSource(
      memory,
      transpile,
      importMap,
      sourceDirectory,
      cwd,
      isDev,
    ),
  );
  middleware.splice(0, 0, staticAsset(raw, sourceDirectory));
  middleware.splice(0, 0, vendorMap(vendor));

  return async (request: Request) => {
    // This is after server.use() has happened. This one should go last as a
    // catch-all. TODO: Add a not found if the URL isn't `/`?
    middleware.push(
      handleRequest(
        lang,
        importMap,
        isDev,
      ),
    );

    const context: Context = {
      request,
      response: {
        status: 200,
        headers: {},
      },
    };

    await handleMiddleware(middleware, context);

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
