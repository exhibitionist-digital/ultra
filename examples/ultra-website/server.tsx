import { QueryClientProvider } from "@tanstack/react-query";
import { serve } from "https://deno.land/std@0.152.0/http/server.ts";
import { compileSync } from "https://esm.sh/@mdx-js/mdx@2.1.3/lib/compile?no-dts";
import rehypeHighlight from "https://esm.sh/rehype-highlight?no-check";
import rehypeSlug from "https://esm.sh/rehype-slug?no-check";
import { createRouter, createServer } from "ultra/server.ts";
import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";
import App from "./src/app.tsx";
import { useDehydrateReactQuery } from "./src/hooks/useDehydrateReactQuery.tsx";
import { queryClient } from "./src/query-client.ts";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

/**
 * Create our API router
 */
const api = createRouter();

/**
 * An example MDX route
 */
api.get("/:slug", async (context) => {
  const source = await Deno.readTextFile(
    `mdx/${context.req.param("slug")}.mdx`,
  );

  const content = String(
    compileSync(source, {
      outputFormat: "function-body",
      useDynamicImport: true,
      rehypePlugins: [rehypeSlug, rehypeHighlight],
    }),
  );
  return context.json({ content });
});

/**
 * Mount the API router to /api
 */
server.route("/api", api);

server.get("*", async (context) => {
  function ServerApp() {
    useDehydrateReactQuery(queryClient);
    return (
      <QueryClientProvider client={queryClient}>
        <Router hook={staticLocationHook(new URL(context.req.url).pathname)}>
          <App />
        </Router>
      </QueryClientProvider>
    );
  }
  /**
   * Render the request
   */
  const result = await server.render(
    <ServerApp />,
  );

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
