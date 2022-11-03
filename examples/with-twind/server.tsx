import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import { getStyleTag } from "twind/sheets";
import { createServer } from "ultra/server.ts";
import { createHeadInsertionTransformStream } from "ultra/stream.ts";
import App from "./src/app.tsx";
import { serverSheet, TWProvider } from "./src/context/twind.tsx";
import { theme } from "./theme.ts";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

server.get("*", async (context) => {
  const sheet = serverSheet();

  /**
   * Render the request
   */
  const result = await server.render(
    <TWProvider sheet={sheet} theme={theme}>
      <App />
    </TWProvider>,
  );

  // Inject the style tag into the head of the streamed response
  const stylesInject = createHeadInsertionTransformStream(() =>
    Promise.resolve(getStyleTag(Array.from(sheet.target)))
  );

  const transformed = result.pipeThrough(stylesInject);

  return context.body(transformed, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
