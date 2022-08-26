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
import { HelmetProvider } from "react-helmet-async";
import useFlushEffects from "ultra/hooks/use-flush-effects.js";

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
api.get("/github", async (context) => {
  const getCount = async () => {
    let data = await fetch(
      `https://api.github.com/repos/exhibitionist-digital/ultra`,
    );
    data = await data.json();
    if (data?.stargazers_count) {
      localStorage.setItem("count", data?.stargazers_count);
      localStorage.setItem("stamp", +new Date());
    }
    return data?.stargazers_count;
  };
  // get count and timestamp from cache
  let count = localStorage.getItem("count");
  const stamp = +localStorage.getItem("stamp");

  // if nothing in cache, this request will be a bit slower
  if (!count) count = await getCount();

  const body = {
    stargazers_count: count || "GitHub",
  };
  // if timestamp is longer than 30 mins...
  // update the cache, but don't await response
  if (stamp && +new Date() > stamp + 1800000) {
    getCount();
  }
  return context.json(body);
});

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
  // deno-lint-ignore no-explicit-any
  const helmetContext: Record<string, any> = {};
  function ServerApp() {
    useFlushEffects(() => {
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
