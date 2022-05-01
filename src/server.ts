import { Middleware } from "./types.ts";
import { createRequestHandler } from "./server/requestHandler.ts";
import { devServerWebsocketPort, isDev, port } from "./env.ts";
import { serve } from "./deps.ts";

export default function () {
  const middleware: Middleware[] = [];
  const requestHandler = createRequestHandler({
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
