import { serve } from "https://deno.land/std@0.152.0/http/server.ts";
import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";
import { createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

server.get("*", async (context) => {
  /**
   * Render the request
   */
  const result = await server.render(
    <Router hook={staticLocationHook(new URL(context.req.url).pathname)}>
      <App />
    </Router>,
  );

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
