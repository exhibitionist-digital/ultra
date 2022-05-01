import type { Context, Middleware } from "../types.ts";
import { Handler } from "../deps.ts";
import { createResponse } from "./response.ts";
import { handleMiddleware } from "./middleware.ts";
import vendorMap from "./middleware/vendorMap.ts";
import staticAsset from "./middleware/staticAsset.ts";
import transpileSource from "./middleware/transpileSource.ts";
import renderPage from "./middleware/renderPage.ts";

export type CreateRequestHandlerOptions = {
  middleware?: Middleware[];
};

export async function createRequestHandler(
  options: CreateRequestHandlerOptions,
): Promise<Handler> {
  const middleware = options.middleware ?? [];

  middleware.splice(0, 0, await transpileSource());
  middleware.splice(0, 0, await staticAsset());
  middleware.splice(0, 0, await vendorMap());

  return async (request: Request) => {
    middleware.push(await renderPage());

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
