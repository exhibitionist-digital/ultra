import { Middleware } from "./types.ts";
import { createRequestHandler } from "./server/requestHandler.ts";
import { devServerWebsocketPort, isDev, port } from "./env.ts";
import { resolveConfig, resolveImportMap } from "./config.ts";
import { serve } from "./deps.ts";

const cwd = Deno.cwd();
const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

export default async function () {
  const middleware: Middleware[] = [];
  const requestHandler = await createRequestHandler({
    importMap,
    middleware,
  });

  let message = `Ultra running http://localhost:${port}`;

  if (isDev) {
    message += ` and ws://localhost:${devServerWebsocketPort}`;
  }

  console.log(message);

  return {
    start: () => {
      serve(requestHandler, {
        port: Number(port),
      });
    },
    use: (middlewareFunction: Middleware) => {
      middleware.push(middlewareFunction);
    },
  };
}
