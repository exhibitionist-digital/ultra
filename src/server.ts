import { serve } from "./deps.ts";
import { isDev, port, root, sourceDirectory, vendorDirectory } from "./env.ts";
import { resolveConfig, resolveImportMap } from "./config.ts";
import { createRequestHandler } from "./server/requestHandler.ts";

const cwd = Deno.cwd();
const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

const server = async () => {
  const requestHandler = await createRequestHandler({
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
};

export default server;
