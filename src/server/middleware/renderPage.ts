import render from "../../render.ts";
import { Middleware } from "../../types.ts";
import { createURL } from "../request.ts";
import { disableStreaming, lang } from "../../env.ts";
import { resolveConfig, resolveImportMap } from "../../config.ts";

export default async function renderPage(): Promise<Middleware> {
  const cwd = Deno.cwd();
  const config = await resolveConfig(cwd);
  const importMap = await resolveImportMap(cwd, config);

  return async (context, next) => {
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
