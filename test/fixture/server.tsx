import App from "@/app.tsx";
import { queryClient } from "@/query-client.tsx";
import { appRouter } from "@/server/router.ts";
import { TRPCServerProvider } from "@/trpc/server.tsx";
import { stringify, tw } from "@/twind.ts";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { serve } from "https://deno.land/std@0.176.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import { createHeadInsertionTransformStream } from "ultra/stream.ts";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
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

  // Inject the style tag into the head of the streamed response
  const stylesInject = createHeadInsertionTransformStream(() => {
    if (Array.isArray(tw.target)) {
      return Promise.resolve(stringify(tw.target));
    }

    throw new Error("Expected tw.target to be an instance of an Array");
  });

  const transformed = result.pipeThrough(stylesInject);

  return context.body(transformed, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});

if (import.meta.main) {
  serve(server.fetch, {
    onListen() {
      // We exit onListen so we know the server started successfully
      // in our tests
      Deno.exit(0);
    },
  });
}

export default server;
