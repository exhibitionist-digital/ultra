import { serve } from "https://deno.land/std@0.176.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import App from "./src/app.tsx";
import { queryClient } from "./src/query-client.tsx";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./src/server/router.ts";
import { TRPCServerProvider } from "./src/trpc/server.tsx";
import { serverSheet, TWProvider } from "./src/context/twind.tsx";
import { theme } from "./theme.ts";

type Environment = {
  Variables: {
    foo?: string;
  };
};

const server = await createServer<Environment, { foo: boolean }>({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

server.use("*", async (context, next) => {
  context.header("x-foo", "bar");
  context.set("foo", "bar");

  await next();
});

server.all("/api/trpc/:path", (context) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: context.req.raw,
    router: appRouter,
    createContext: () => ({}),
  });
});

server.get("*", async (context) => {
  const sheet = serverSheet();
  // clear query cache
  queryClient.clear();

  const requestUrl = new URL(context.req.url);

  const entrypoint = requestUrl.pathname === "/foo"
    ? import.meta.resolve("./client.foo.tsx")
    : import.meta.resolve("./client.tsx");

  /**
   * Render the request
   */
  const result = await server.render(
    <TRPCServerProvider>
      <TWProvider sheet={sheet} theme={theme}>
        <App />
      </TWProvider>
    </TRPCServerProvider>,
    {
      entrypoint,
    },
  );

  return context.body(result, 200, {
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
