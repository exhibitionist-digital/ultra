import type { FunctionComponent } from "react";
import { isDev, port, root, sourceDirectory, vendorDirectory } from "../env.ts";
import { resolveConfig, resolveImportMap } from "../config.ts";
import { serve } from "../deps.ts";
import { createRequestHandler } from "../server/requestHandler.ts";
import type { RequestContext, ServerOptions } from "./types.ts";

const cwd = Deno.cwd();
const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

export function unstable_ultra(
  App: FunctionComponent<{ requestContext: RequestContext }>,
  options?: ServerOptions,
): Promise<void> {
  const requestHandler = createRequestHandler({
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
