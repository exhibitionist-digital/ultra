import assets from "../assets.ts";
import type { Context, ImportMap, Middleware } from "../types.ts";
import { Handler } from "../deps.ts";
import { createResponse } from "./response.ts";
import { handleMiddleware } from "./middleware.ts";
import { lang, sourceDirectory, vendorDirectory } from "../env.ts";
import vendorMap from "./middleware/vendorMap.ts";
import staticAsset from "./middleware/staticAsset.ts";
import transpileSource from "./middleware/transpileSource.ts";
import renderPage from "./middleware/renderPage.ts";

export type CreateRequestHandlerOptions = {
  importMap: ImportMap;
  middleware?: Middleware[];
};

export async function createRequestHandler(
  options: CreateRequestHandlerOptions,
): Promise<Handler> {
  const { importMap } = options;
  const middleware = options.middleware ?? [];

  const [raw, vendor] = await Promise.all([
    assets(sourceDirectory),
    assets(`.ultra/${vendorDirectory}`),
  ]);

  middleware.splice(0, 0, transpileSource(raw, importMap));
  middleware.splice(0, 0, staticAsset(raw));
  middleware.splice(0, 0, vendorMap(vendor));

  return async (request: Request) => {
    middleware.push(renderPage(importMap));

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
