import { Context, NativeRequest } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import type { ServerRequest } from "https://deno.land/x/oak@v10.5.1/types.d.ts";
import { isDev, sourceDirectory, vendorDirectory } from "../env.ts";
import { resolveConfig, resolveImportMap } from "../config.ts";
import { createRequestHandler } from "../server/requestHandler.ts";

const cwd = Deno.cwd();

const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

/**
 * @see https://github.com/oakserver/oak/issues/501
 */
function isNativeRequest(
  serverRequest: ServerRequest,
): serverRequest is NativeRequest {
  // deno-lint-ignore no-explicit-any
  return (serverRequest as any).serverRequest instanceof Request;
}

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
  const request = isNativeRequest(context.request.originalRequest)
    ? context.request.originalRequest.request
    : null;

  if (!request) {
    // Not sure if this will ever be the case?
    throw new Error("Not a native Request!");
  }

  const response = await requestHandler(request);

  context.response.body = response.body;
  context.response.headers = response.headers;
}
