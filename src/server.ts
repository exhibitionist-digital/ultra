import { createElement } from "react";
import { Application } from "./app.ts";
import { ServerAppComponent, ServerOptions } from "./types.ts";
import { toCompilerUrl } from "./utils.ts";
import { parseImportMap, RequestHandler, toFileUrl } from "./deps.ts";
import { createRouter } from "./router.ts";
import { render } from "./render.ts";
import { resolveImportMap } from "./config.ts";
import { ImportVisitor } from "./ast/import.ts";

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

  const importMap = await resolveImportMap(rootUrl.pathname);
  const parsedImportMap = parseImportMap(importMap, rootUrl);

  let { bootstrapModules = [] } = options;

  bootstrapModules = bootstrapModules.map(
    (bootstrapModule) => toCompilerUrl(bootstrapModule, compilerPath),
  );

  const renderHandler: RequestHandler<Application> = (context) => {
    return render(createElement(app, { state: context.state }), {
      bootstrapModules,
    });
  };

  const router = await createRouter({
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

  server.compiler.addVisitor(new ImportVisitor(parsedImportMap));

  await server.compiler.init(
    "https://cdn.esm.sh/@swc/wasm-web@1.2.182/wasm-web_bg.wasm",
  );

  server.addEventListener("listening", (event) => {
    const message = `Ultra running on http://localhost:${event.detail.port}`;
    console.log(message);
  });

  return server;
}
