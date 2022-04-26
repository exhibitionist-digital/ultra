import { isDev, port, root, sourceDirectory, vendorDirectory } from "../env.ts";
import { resolveConfig, resolveImportMap } from "../config.ts";
import { serve } from "../deps.ts";
import { createRequestHandler } from "./server/requestHandler.ts";
import type {
  AppComponent,
  AppProps,
  RequestContext,
  ServerOptions,
} from "./types.ts";
import { createRenderer } from "./render.tsx";

const cwd = Deno.cwd();
const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

function defaultCreateRequestContext(request: Request): RequestContext {
  return {
    url: new URL(request.url),
    state: new Map(),
    helmetContext: {
      helmet: {},
    },
  };
}

export function unstable_ultra<T extends AppProps>(
  App: AppComponent<T>,
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
