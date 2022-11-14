import { sheet } from "./src/twind.ts";
import { serve } from "https://deno.land/std@0.164.0/http/server.ts";
import { getStyleTag } from "twind/sheets";
import { createServer } from "ultra/server.ts";
import { createHeadInsertionTransformStream } from "ultra/stream.ts";
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

  // Inject the style tag into the head of the streamed response
  const stylesInject = createHeadInsertionTransformStream(() => {
    if (sheet.target instanceof Set) {
      return Promise.resolve(getStyleTag(Array.from(sheet.target)));
    }

    throw new Error("Expected sheet.target to be an instance of Set");
  });

  const transformed = result.pipeThrough(stylesInject);

  return context.body(transformed, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
