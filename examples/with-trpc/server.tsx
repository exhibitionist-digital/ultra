import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createServer } from "ultra/server.ts";
import App from "./src/app.tsx";
import { queryClient } from "./src/query-client.tsx";
import { appRouter } from "./src/server/router.ts";
import { TRPCServerProvider } from "./src/trpc/server.tsx";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

server.all("/api/trpc/:path", (context) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: context.req as Request,
    router: appRouter,
    createContext: () => ({}),
  });
});

server.get("*", async (context) => {
  // clear query cache
  queryClient.clear();

  /**
   * Render the request
   */
  const result = await server.render(
    <TRPCServerProvider>
      <App />
    </TRPCServerProvider>,
  );

  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});

if (import.meta.main) {
  Deno.serve(server.fetch);
}

export default server;
