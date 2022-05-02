import render from "../../render.ts";
import { ImportMap, Middleware } from "../../types.ts";
import { createURL } from "../request.ts";
import { disableStreaming, lang } from "../../env.ts";

export default function createRenderPageMiddleware(
  importMap: ImportMap,
): Middleware {
  return async function renderPageMiddleware(context, next) {
    const url = createURL(context.request);

    const body = await render({
      url,
      importMap,
      lang,
      disableStreaming,
    });

    context.response.body = body;
    context.response.headers = {
      ...context.response.headers,
      "content-type": "text/html; charset=utf-8",
    };

    await next(true);
  };
}
