import { serve } from "https://deno.land/std@0.173.0/http/server.ts";
import { HelmetProvider } from "react-helmet-async";
import useServerInsertedHTML from "ultra/hooks/use-server-inserted-html.js";
import { createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

// deno-lint-ignore no-explicit-any
const helmetContext: Record<string, any> = {};

const ServerApp = function () {
  useServerInsertedHTML(() => {
    const { helmet } = helmetContext;
    return (
      <>
        {helmet.title.toComponent()}
        {helmet.priority.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {helmet.script.toComponent()}
      </>
    );
  });

  return (
    <HelmetProvider context={helmetContext}>
      <App />
    </HelmetProvider>
  );
};

server.get("*", async (context) => {
  /**
   * Render the request
   */
  const result = await server.render(<ServerApp />);

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
