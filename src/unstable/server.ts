import type { FunctionComponent } from "react";
import { isDev, port, root, sourceDirectory, vendorDirectory } from "../env.ts";
import { resolveConfig, resolveImportMap } from "../config.ts";
import { serve } from "../deps.ts";
import { createRequestHandler } from "./server/requestHandler.ts";
import type { ServerOptions, ServerRequestContext } from "./types.ts";
import { createRenderer } from "./render.ts";

const cwd = Deno.cwd();
const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

function defaultCreateRequestContext(request: Request): ServerRequestContext {
  return {
    url: new URL(request.url),
    state: new Map(),
    helmetContext: {
      helmet: {},
    },
  };
}

export function unstable_ultra(
  App: FunctionComponent<{ requestContext: ServerRequestContext }>,
  options?: ServerOptions,
): Promise<void> {
  const { createRequestContext = defaultCreateRequestContext } = options || {};
  const render = createRenderer(App);

  const requestHandler = createRequestHandler({
    render,
    createRequestContext,
    cwd,
    importMap,
    paths: {
      source: sourceDirectory,
      vendor: vendorDirectory,
    },
    isDev,
  });

  console.log(`Ultra running ${root}`);

  return serve(requestHandler, { port: +port });
}
