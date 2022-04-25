import { isDev, port, root, sourceDirectory, vendorDirectory } from "../env.ts";
import { resolveConfig, resolveImportMap } from "../config.ts";
import { serve } from "../deps.ts";
import { createRequestHandler } from "./server/requestHandler.ts";
import type { RenderStrategy, RequestContext, ServerOptions } from "./types.ts";
import { createRenderer } from "./render.tsx";
import type { FunctionComponent } from "react";

const cwd = Deno.cwd();
const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

const defaultLocale = "en";
const defaultRenderStrategy: RenderStrategy = "stream";

function defaultCreateRequestContext(request: Request): RequestContext {
  return {
    url: new URL(request.url),
    state: new Map(),
    helmetContext: {
      helmet: {},
    },
    locale: defaultLocale,
    renderStrategy: defaultRenderStrategy,
  };
}

export function unstable_ultra<T extends FunctionComponent>(
  App: T,
  options?: ServerOptions,
): Promise<void> {
  const { createRequestContext = defaultCreateRequestContext } = options || {};
  const render = createRenderer(App);

  const _createRequestContext = async (
    request: Request,
  ): Promise<RequestContext> => {
    if (createRequestContext === defaultCreateRequestContext) {
      return defaultCreateRequestContext(request);
    }

    const defaultRequestContext = await defaultCreateRequestContext(request);
    const requestContext = await createRequestContext(request);

    return Object.assign(defaultRequestContext, requestContext);
  };

  const requestHandler = createRequestHandler({
    render,
    createRequestContext: _createRequestContext,
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
