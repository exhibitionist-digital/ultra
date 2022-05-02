import { Context } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { createRequestHandler } from "../server/requestHandler.ts";
import createRequestHandlerMiddleware from "../server/middleware/createRequestHandlerMiddleware.ts";

const requestHandler = createRequestHandler({
  middleware: [
    await createRequestHandlerMiddleware(),
  ],
});

export async function ultraHandler(context: Context) {
  const serverRequestBody = context.request.originalRequest.getBody();

  const request = new Request(context.request.url.toString(), {
    method: context.request.originalRequest.method,
    headers: context.request.originalRequest.headers,
    body: serverRequestBody.body,
  });

  const response = await requestHandler(request);

  context.response.status = response.status;
  context.response.headers = response.headers;
  context.response.body = response.body;
}
