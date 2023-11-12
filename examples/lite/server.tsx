import { renderToReadableStream } from "react-dom/server";
import { createCompilerHandler } from "ultra/lib/react/compiler.ts";
import { createRenderHandler } from "ultra/lib/react/renderer.ts";
import UltraServer from "ultra/lib/react/server.js";
import { RequestHandler, composeHandlers } from "ultra/lib/handler.ts";

import App from "./app.tsx";

const root = Deno.cwd();

const importMap = {
  "imports": {
    "react": "https://esm.sh/v122/react@18.2.0?dev",
    "react/": "https://esm.sh/v122/react@18.2.0/",
    "react-dom": "https://esm.sh/v122/react-dom@18.2.0",
    "react-dom/server": "https://esm.sh/v122/react-dom@18.2.0/server?dev",
    "react-dom/client": "https://esm.sh/v122/react-dom@18.2.0/client?dev",
    "ultra/": root,
    "ultra/lib/react/client.js": "/ultra-github-proxy/https://raw.githubusercontent.com/exhibitionist-digital/ultra/main/lib/react/client.js"
  }
}

const renderer = createRenderHandler({
  root,
  render(request) {
    return renderToReadableStream(
      <UltraServer request={request} importMap={importMap}>
        <App />
      </UltraServer>,
      {
        bootstrapModules: [
          import.meta.resolve("./app.tsx"),
        ],
      },
    );
  },
});

const compiler = createCompilerHandler({
  root,
});

// @todo(Danielduel): Do we want to have an util to do proxies with feature like
//                    this one + an ability to transform content (f.e. compile)
const handleGithubRawProxy: RequestHandler = {
  supportsRequest: (request) => {
    return request.url.includes("/ultra-github-proxy/");
  },
  handleRequest: async (request) => {
    const { pathname } = new URL(request.url);
    const realPathName = pathname.split("/ultra-github-proxy/")[1];
    const content = await fetch(realPathName);

    return new Response(
      content.body,
      {
        headers: {
          "Content-Type": "application/javascript",
        },
      },
    );
  },
}

const executeHandlers = composeHandlers(
  compiler,
  renderer,
  handleGithubRawProxy,
);

Deno.serve((request) => {
  const response = executeHandlers(request);
  if (response) return response;

  return new Response("Not Found", { status: 404 });
});
