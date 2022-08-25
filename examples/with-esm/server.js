import { serve } from "https://deno.land/std@0.153.0/http/server.ts";
import React from "react";
import { createServer } from "ultra/server.ts";
import App from "./src/app.js";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.js"),
});

server.get("*", async (context) => {
  /**
   * Render the request
   */
  const result = await server.render(React.createElement(App));

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
