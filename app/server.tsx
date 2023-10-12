import { createRenderer } from "ultra/lib/react/renderer.ts";
import { renderToReadableStream } from "react-dom/server";
import App from "./app.tsx";

const renderer = createRenderer({
  render(request) {
    return renderToReadableStream(<App />, {
      bootstrapModules: [
        import.meta.resolve("./client.tsx"),
      ],
    });
  },
});

Deno.serve(renderer.handleRequest);
