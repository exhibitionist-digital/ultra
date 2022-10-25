import { serve } from "https://deno.land/std@0.153.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import App from "./src/app.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, useDehydrateReactQuery } from "./src/query-client.tsx";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./src/server/router.ts";
import { trpc } from "./src/trpc/trpc.ts";
import { trpcClient } from "./src/trpc/server.ts";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

function ServerApp({ context }: any) {
  useDehydrateReactQuery(queryClient);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

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
  const result = await server.render(<ServerApp context={context} />);

  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});

if (import.meta.main) {
  serve(server.fetch);
}

export default server;
