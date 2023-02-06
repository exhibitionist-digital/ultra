import { serve } from "https://deno.land/std@0.176.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";
import App from "./src/app.tsx";
import { SearchParamsProvider } from "./src/context/SearchParams.tsx";

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
  const requestUrl = new URL(context.req.url);
  const result = await server.render(
    <Router hook={staticLocationHook(requestUrl.pathname)}>
      <SearchParamsProvider value={requestUrl.searchParams}>
        <App />
      </SearchParamsProvider>
    </Router>,
  );

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
