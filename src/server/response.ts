import { Context } from "../types.ts";

export function createResponse(context: Context): Response {
  const responseInit: ResponseInit = {};

  if (context.response.headers) {
    responseInit.headers = context.response.headers;
  }

  if (context.response.status) {
    responseInit.status = context.response.status;
  }

  if (context.response.statusText) {
    responseInit.statusText = context.response.statusText;
  }

  return new Response(context.response.body, responseInit);
}
