import { isDev, port, root, sourceDirectory, vendorDirectory } from "../env.ts";
import { resolveConfig, resolveImportMap } from "../config.ts";
import { serve } from "../deps.ts";
import { createRequestHandler } from "./server/requestHandler.ts";
import type { ServerOptions } from "./types.ts";
import { createRenderer } from "./render.tsx";
import type { FunctionComponent } from "react";

const cwd = Deno.cwd();
const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

export function unstable_ultra<T extends FunctionComponent>(
  App: T,
  options?: ServerOptions,
): Promise<void> {
  const { createRequestContext } = options || {};
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
