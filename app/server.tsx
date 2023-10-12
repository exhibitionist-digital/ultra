import { createRenderer } from "ultra/lib/react/renderer.ts";
import { renderToReadableStream } from "react-dom/server";
import App from "./app.tsx";
import { createCompiler } from "ultra/lib/compiler.ts";

const importMap = {
  imports: {
    "react": "https://esm.sh/react@18",
    "react/": "https://esm.sh/react@18/",
    "react-dom/": "https://esm.sh/react-dom@18&external=react/",
  },
};

const renderer = createRenderer({
  importMap,
  render(request) {
    return renderToReadableStream(<App />, {
      bootstrapModules: [
        import.meta.resolve("./client.tsx"),
      ],
    });
  },
});

const compiler = createCompiler({
  root: Deno.cwd(),
});

Deno.serve((request) => {
  const url = new URL(request.url, "http://localhost");

  if (url.pathname === "/favicon.ico") {
    return new Response(null, { status: 404 });
  }

  if (url.pathname.startsWith("/_ultra/")) {
    return compiler.handleRequest(request);
  }

  return renderer.handleRequest(request);
});
