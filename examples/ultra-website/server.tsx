// @ts-nocheck wip
import { QueryClientProvider } from "@tanstack/react-query";
import { serve } from "https://deno.land/std@0.152.0/http/server.ts";
import { createRouter, createServer } from "ultra/server.ts";
import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";
import App from "./src/app.tsx";
import { useDehydrateReactQuery } from "./src/hooks/useDehydrateReactQuery.tsx";
import { queryClient } from "./src/query-client.ts";
import { HelmetProvider } from "react-helmet-async";
import useServerInsertedHTML from "ultra/hooks/use-server-inserted-html.js";
import { getStarCount } from "./src/api/github.ts";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

/**
 * Create our API router
 */
const api = createRouter();

api.get("/github", async (context) => {
  const data = await getStarCount();
  return context.json(data);
});

server.route("/api", api);

server.get("*", async (context) => {
  queryClient.clear();

  await queryClient.prefetchQuery(getStarCount.keys(), getStarCount);

  // deno-lint-ignore no-explicit-any
  const helmetContext: Record<string, any> = {};

  function ServerApp() {
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
    useDehydrateReactQuery(queryClient);
    return (
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <Router hook={staticLocationHook(new URL(context.req.url).pathname)}>
            <App />
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
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
