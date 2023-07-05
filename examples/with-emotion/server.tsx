import { createServer } from "ultra/server.ts";
import { emotionTransformStream } from "./server/emotion.ts";
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
  const result = await server.render(<App />);
  const transformed = emotionTransformStream(result);

  return context.body(transformed, 200, {
    "content-type": "text/html",
  });
});

Deno.serve(server.fetch);
