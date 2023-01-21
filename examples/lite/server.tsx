import { serve } from "https://deno.land/std@0.173.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import App from "./app.tsx";
import React from "react";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./app.tsx"),
});

server.get("*", async (context) => {
  /**
   * Render the request
   */
  const result = await server.render(<App />);

  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});

if (import.meta.main) {
  serve(server.fetch);
}

export default server;
