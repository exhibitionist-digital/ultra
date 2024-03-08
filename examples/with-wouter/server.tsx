import { createServer } from "ultra/server.ts";
import { Router } from "wouter";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

server.get("*", async (context) => {
  /**
   * Render the request
   */
  const requestUrl = new URL(context.req.url);

  const result = await server.render(
    <Router ssrPath={requestUrl.pathname} ssrSearch={requestUrl.search}>
      <App />
    </Router>,
  );

  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});

if (import.meta.main) {
  Deno.serve(server.fetch);
}

export default server;
