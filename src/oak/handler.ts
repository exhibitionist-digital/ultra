import { Context, Middleware } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { isDev, sourceDirectory, vendorDirectory } from "../env.ts";
import { resolveConfig, resolveImportMap } from "../config.ts";
import { createRequestHandler } from "../server/requestHandler.ts";

const cwd = Deno.cwd();

const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

const requestHandler = await createRequestHandler({
  cwd,
  importMap,
  paths: {
    source: sourceDirectory,
    vendor: vendorDirectory,
  },
  isDev,
});

export const ultraHandler: Middleware = async (context: Context, next) => {
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

  await next();
};
