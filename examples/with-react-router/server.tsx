import { StaticRouter } from "react-router-dom/server";
import { createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

server.get("*", async (context) => {
  /**
   * Render the request with context
   */
  const result = await server.renderWithContext(
    <StaticRouter location={new URL(context.req.url).pathname}>
      <App />
    </StaticRouter>,
    context,
  );

  return context.body(result, undefined, {
    "content-type": "text/html; charset=utf-8",
  });
});

Deno.serve(server.fetch);
