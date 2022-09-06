import { serve } from "https://deno.land/std@0.153.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import { emotionTransformStream } from "./server/emotion.ts";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
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

serve(server.fetch);
