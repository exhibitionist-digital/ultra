import { Context } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { isDev, sourceDirectory, vendorDirectory } from "../env.ts";
import { resolveConfig, resolveImportMap } from "../config.ts";
import { createRequestHandler } from "../server/requestHandler.ts";

const cwd = Deno.cwd();

const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

const requestHandler = createRequestHandler({
  cwd,
  importMap,
  paths: {
    source: sourceDirectory,
    vendor: vendorDirectory,
  },
  isDev,
});

export async function ultraHandler(context: Context) {
  const request = new Request(context.request.url.toString(), {
    method: context.request.originalRequest.method,
    headers: context.request.originalRequest.headers,
  });

  const response = await requestHandler(request);

  return context.request.originalRequest.respond(response);
}
