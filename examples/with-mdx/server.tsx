import { serve } from "https://deno.land/std@0.153.0/http/server.ts";
import { createRouter, createServer } from "ultra/server.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { useDehydrateReactQuery } from "./src/hooks/useDehydrateReactQuery.tsx";
import { queryClient } from "./src/query-client.ts";
import { compile } from "https://esm.sh/@mdx-js/mdx/lib/compile";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

function ServerApp() {
  useDehydrateReactQuery(queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

/**
 * Create our API router
 */
const api = createRouter();

/**
 * An example MDX route
 */
api.get("/docs", async (context) => {
  const source = await Deno.readTextFile(
    `mdx/docs.mdx`,
  );

  const content = String(
    await compile(source, {
      outputFormat: "function-body",
      useDynamicImport: true,
    }),
  );
  const body = JSON.stringify({ content });
  return context.json(body);
});

/**
 * Mount the API router to /api
 */
server.route("/api", api);

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
