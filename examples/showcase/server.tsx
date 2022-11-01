import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

// tw
import { serverSheet, TWProvider } from "./src/context/twind.tsx";
import { getStyleTag } from "twind/sheets";
import { createHeadInjectionTransformStream } from "ultra/stream.ts";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

server.get("/", async (context) => {
  const inspected = context.req.query("inspector") || "";
  /**
   * Render the request
   */
  const result = await server.render(<App inspected={inspected} />, {
    disableHydration: true,
  });

  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});

server.get("*", async (context) => {
  const pathname = new URL(context.req.url).pathname;
  const sheet = serverSheet();

  /**
   * Render the request
   */
  const result = await server.render(
    <TWProvider sheet={sheet}>
      <App pathname={pathname} />
    </TWProvider>,
  );

  // Inject the style tag into the head of the streamed response
  const stylesInject = createHeadInjectionTransformStream(() =>
    Promise.resolve(getStyleTag(Array.from(sheet.target)))
  );

  const transformed = result.pipeThrough(stylesInject);

  return context.body(transformed, 200, {
    "content-type": "text/html",
  });
});

if (import.meta.main) {
  serve(server.fetch);
}

export default server;
