import type { Context, Middleware } from "../types.ts";
import { Handler } from "../deps.ts";
import { createResponse } from "./response.ts";
import { handleMiddleware } from "./middleware.ts";

export type CreateRequestHandlerOptions = {
  middleware: Middleware[];
};

export function createRequestHandler(
  { middleware }: CreateRequestHandlerOptions,
): Handler {
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
