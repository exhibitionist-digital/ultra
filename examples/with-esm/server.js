import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import React from "react";
import { createServer } from "ultra/server.ts";
import App from "./src/app.js";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
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
