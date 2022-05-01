import type { Context, Middleware, RequestHandler } from "../types.ts";
import { createResponse } from "./response.ts";
import { handleMiddleware } from "./middleware.ts";

export type CreateRequestHandlerOptions = {
  middleware: Middleware[];
};

export function createRequestHandler(
  { middleware }: CreateRequestHandlerOptions,
): RequestHandler {
  return async (request: Request) => {
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
