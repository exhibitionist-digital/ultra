import { renderToReadableStream } from "react-dom/server";
import { createCompiler } from "ultra/lib/react/compiler.ts";
import { createRenderer } from "ultra/lib/react/renderer.ts";
import App from "./app.tsx";

const importMap = {
  imports: {
    "react": "https://esm.sh/react@18?dev",
    "react/": "https://esm.sh/react@18&dev/",
    "react-dom/": "https://esm.sh/react-dom@18&dev&external=react/",
  },
};

const root = Deno.cwd();

const renderer = createRenderer({
  root,
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

  return renderer.handleRequest(request);
});
