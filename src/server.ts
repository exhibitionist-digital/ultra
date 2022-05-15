import { createElement } from "react";
import { Application } from "./app.ts";
import type {
  RequestHandler,
  ServerAppComponent,
  ServerOptions,
} from "./types.ts";
import { toCompilerUrl } from "./utils.ts";
import { parseImportMap, toFileUrl } from "./deps.ts";
import { render } from "./render.ts";
import { resolveImportMap } from "./config.ts";
import { ultraPlugin } from "./internal/plugins/ultra.ts";

export default async function createServer(
  app: ServerAppComponent,
  options: ServerOptions = {},
) {
  const {
    mode = "production",
    publicPath = "public",
    rootUrl = toFileUrl(Deno.cwd()),
    compilerPath = "/@ultra/compiler/",
    renderStrategy,
  } = options;

  const importMap = await resolveImportMap(rootUrl.pathname);

  const parsedImportMap = parseImportMap(
    importMap,
    new URL("", import.meta.url),
  );

  let { bootstrapModules = [] } = options;

  bootstrapModules = bootstrapModules.map(
    (bootstrapModule) => toCompilerUrl(bootstrapModule, compilerPath),
  );

  const renderHandler: RequestHandler = async (context) => {
    const strategy = renderStrategy
      ? typeof renderStrategy === "string"
        ? renderStrategy
        : await renderStrategy(context.request)
      : "stream";

    return render(createElement(app, { state: context.state, strategy }), {
      strategy,
      bootstrapModules,
    });
  };

  const server = new Application({
    mode,
    rootUrl,
  });

  /**
   * Setup Ultra
   */
  server.register(ultraPlugin, {
    rootUrl,
    publicPath,
    compilerPath,
    importMap: parsedImportMap,
    bootstrapModules,
  });

  server.add("GET", "/*", renderHandler);

  await server.compiler.init(
    "https://cdn.esm.sh/@swc/wasm-web@1.2.182/wasm-web_bg.wasm",
  );

  if (mode === "development") {
    const { devPlugin } = await import("./internal/plugins/dev.ts");
    server.register(devPlugin);
  }

  server.addEventListener("listening", (event) => {
    const message = `Ultra running on http://localhost:${event.detail.port}`;
    console.log(message);
  });

  return server;
}
