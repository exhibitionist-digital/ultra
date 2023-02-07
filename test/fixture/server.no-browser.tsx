import { serve } from "https://deno.land/std@0.176.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import App from "./src/app.tsx";
import { queryClient } from "./src/query-client.tsx";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./src/server/router.ts";
import { TRPCServerProvider } from "./src/trpc/server.tsx";
import { serverSheet, TWProvider } from "./src/context/twind.tsx";
import { theme } from "./theme.ts";

const server = await createServer();

server.all("/api/trpc/:path", (context) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: context.req as Request,
    router: appRouter,
    createContext: () => ({}),
  });
});

server.get("*", async (context) => {
  const sheet = serverSheet();
  // clear query cache
  queryClient.clear();

  /**
   * Render the request
   */
  const result = await server.render(
    <TRPCServerProvider>
      <TWProvider sheet={sheet} theme={theme}>
        <App />
      </TWProvider>
    </TRPCServerProvider>,
  );

  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});

if (import.meta.main) {
  serve(server.fetch, {
    onListen() {
      Deno.exit(0);
    },
  });
}

export default server;
