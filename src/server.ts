import { Application } from "./app.ts";
import {
  devServerWebsocketPort,
  isDev,
  port,
  sourceDirectory,
  vendorDirectory,
} from "./env.ts";
import { resolveConfig, resolveImportMap } from "./config.ts";
import { createRequestHandler } from "./server/requestHandler.ts";

const cwd = Deno.cwd();
const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

const server = () => {
  const server = new Application({
    mode: isDev ? "development" : "production",
    rootUrl: cwd,
  });

  server.addEventListener("listening", (event) => {
    let message = `Ultra running http://localhost:${event.detail.port}`;

    if (isDev) {
      message += ` and ws://localhost:${devServerWebsocketPort}`;
    }
    console.log(message);
  });

  return server;
};

export default server;
