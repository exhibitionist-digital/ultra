import { renderToReadableStream } from "react-dom/server";
import { createImportMapProxy } from "ultra/lib/importMap.ts";
import { createCompilerHandler } from "ultra/lib/react/compiler.ts";
import { createRenderHandler } from "ultra/lib/react/renderer.ts";
import UltraServer from "ultra/lib/react/server.js";
import App from "./app.tsx";

const importMap = {
  imports: {
    "react": "https://esm.sh/react@18?dev",
    "react/": "https://esm.sh/react@18&dev/",
    "react-dom/": "https://esm.sh/react-dom@18&dev&external=react/",
    "/~/": import.meta.resolve("./"),
  },
};

const root = Deno.cwd();

const proxiedImportMap = await createImportMapProxy(importMap, root);

const renderer = createRenderHandler({
  root,
  importMap: proxiedImportMap,
  render(request) {
    return renderToReadableStream(
      <UltraServer request={request}>
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

Deno.serve((request) => {
  const url = new URL(request.url, "http://localhost");

  if (url.pathname === "/favicon.ico") {
    return new Response(null, { status: 404 });
  }

  if (compiler.supportsRequest(request)) {
    return compiler.handleRequest(request);
  }

  if (renderer.supportsRequest(request)) {
    return renderer.handleRequest(request);
  }

  return new Response("Not Found", { status: 404 });
});
