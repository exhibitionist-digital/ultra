import { createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
});

/**
 * Default route
 */
server.get("*", async (context) => {
  /**
   * Render the request
   */
  const result = await server.render(<App request={context.req} />, {
    generateStaticHTML: true,
  });

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

// Use Deno flash server
// @ts-ignore flash type 404
Deno.serve({ port: 8000 }, server.fetch);
