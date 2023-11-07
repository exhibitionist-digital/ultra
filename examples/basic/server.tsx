import { renderToReadableStream } from "react-dom/server";
import { createCompilerHandler } from "ultra/lib/react/compiler.ts";
import { createRenderHandler } from "ultra/lib/react/renderer.ts";
import UltraServer from "ultra/lib/react/server.js";
import App from "./src/app.tsx";
import { readImportMap } from "ultra/lib/utils/import-map.ts";
import { createStaticHandler } from "ultra/lib/static/handler.ts";
import { composeHandlers } from "ultra/lib/handler.ts";

const root = Deno.cwd();

// change hash

const importMap = Deno.env.get("ULTRA_MODE") === "development"
  ? await readImportMap("./importMap.dev.json")
  : await readImportMap("./importMap.json");

const renderer = createRenderHandler({
  root,
  render(request) {
    return renderToReadableStream(
      <UltraServer request={request} importMap={importMap}>
        <App />
      </UltraServer>,
      {
        bootstrapModules: [
          import.meta.resolve("./client.tsx"),
        ],
      },
    );
  },
});

const compiler = createCompilerHandler({
  root,
});

const staticHandler = createStaticHandler({
  pathToRoot: import.meta.resolve("./public"),
});

const executeHandlers = composeHandlers(
  compiler,
  renderer,
  staticHandler
);

Deno.serve((request) => {
  const response = executeHandlers(request);
  if (response) return response;

  return new Response("Not Found", { status: 404 });
});
