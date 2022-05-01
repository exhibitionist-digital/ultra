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
  middleware?: Middleware[];
};

export async function createRequestHandler(
  options: CreateRequestHandlerOptions,
): Promise<Handler> {
  const {
    cwd,
    importMap,
    paths: { source: sourceDirectory, vendor: vendorDirectory },
  } = options;
  const middleware = options.middleware ?? [];
  const isDev = Boolean(options.isDev);

  const memory = new LRU<string>(500);
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

    return createResponse(context);
  };
}
