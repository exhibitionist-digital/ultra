import { createElement } from "react";
import { Application } from "./app.ts";
import { devServerWebsocketPort, isDev } from "./env.ts";
import { ServerAppComponent, ServerOptions } from "./types.ts";
import { toCompilerUrl } from "./utils.ts";
import { RequestHandler, toFileUrl } from "./deps.ts";
import { createRouter } from "./router.ts";
import { render } from "./render.ts";

export default async function createServer(
  app: ServerAppComponent,
  options: ServerOptions = {},
) {
  const {
    mode = "production",
    publicPath = "public",
    rootUrl = toFileUrl(Deno.cwd()),
    compilerPath = "/@compiler/",
  } = options;

  let { bootstrapModules = [] } = options;

  bootstrapModules = bootstrapModules.map(
    (bootstrapModule) => toCompilerUrl(bootstrapModule, compilerPath),
  );

  const renderHandler: RequestHandler<Application> = (context) => {
    return render(createElement(app, { state: context.state }), {
      bootstrapModules,
    });
  };

  const router = createRouter({
    renderHandler,
    rootUrl,
    publicPath,
    compilerPath,
  });

  const server = new Application({
    mode,
    router,
    rootUrl,
  });

  await server.compiler.init(
    "https://cdn.esm.sh/@swc/wasm-web@1.2.182/wasm-web_bg.wasm",
  );

  server.addEventListener("listening", (event) => {
    let message = `Ultra running http://localhost:${event.detail.port}`;

    if (isDev) {
      message += ` and ws://localhost:${devServerWebsocketPort}`;
    }
    console.log(message);
  });

  return server;
}
