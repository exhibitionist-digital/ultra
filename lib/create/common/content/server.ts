import { Config } from "../config.ts";
import { fileExtension } from "../io.ts";
import { printer } from "../printer.ts";

export function serverContent(config: Config) {
  const p = printer(config);
  const ext = fileExtension(config);

  return `
import { serve } from "https://deno.land/std@0.164.0/http/server.ts";
import { createServer ${
    config.ts ? ", type Context" : ""
  } } from "ultra/server.ts";
import App from "${ext("./src/app", true)}";

${
    p.twind(`// Twind
import "${ext("./src/twind/twind", false)}";
`)
  }

${
    p.reactRouter(`// React Router
import { StaticRouter } from "react-router-dom/server";
`)
  }

${
    p.wouter(`// Wouter   
import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";
import { SearchParamsProvider } from "${ext("./src/wouter/index", true)}";
`)
  }

${
    p.reactHelmetAsync(`// React Helmet Async
import { HelmetProvider } from "react-helmet-async";
import useServerInsertedHTML from "ultra/hooks/use-server-inserted-html.js";
`)
  }

${
    p.reactQuery(`// React Query
import { QueryClientProvider } from "@tanstack/react-query";
import { useDehydrateReactQuery } from "${
      ext("./src/react-query/useDehydrateReactQuery", true)
    }";
import { queryClient } from "${ext("./src/react-query/query-client", false)}";
`)
  }

  const server = await createServer({
    importMapPath: import.meta.resolve("./importMap.json"),
    browserEntrypoint: import.meta.resolve("${ext("./client", true)}"),
  });

${
    p.reactHelmetAsync(`
${
      config.ts
        ? `
// deno-lint-ignore no-explicit-any
const helmetContext: Record<string, any> = {};
`
        : "const helmetContext = {};"
    }`)
  }

${
    config.ts
      ? "function ServerApp({context}: { context: Context }){"
      : "function ServerApp({context}){"
  }

${
    p.reactHelmetAsync(`
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
`)
  }


${
    p.reactQuery(
      `useDehydrateReactQuery(queryClient)`,
    )
  }

const requestUrl = new URL(context.req.url)

return (

${p.reactHelmetAsync("<HelmetProvider context={helmetContext}>")}
${
    p.reactQuery(
      "<QueryClientProvider client={queryClient}>",
    )
  }
${p.reactRouter("<StaticRouter location={new URL(context.req.url).pathname}>")}
${
    p.wouter(`
<Router hook={staticLocationHook(requestUrl.pathname)}>
<SearchParamsProvider value={requestUrl.searchParams}>
`)
  }

<App />

${p.wouter("</SearchParamsProvider></Router>")}
${p.reactRouter("</StaticRouter>")}
${p.reactQuery("</QueryClientProvider>")}
${p.reactHelmetAsync("</HelmetProvider>")}

)
}

server.get("*", async (context) => {
  ${
    p.reactQuery(`// clear query cache
  queryClient.clear();
  `)
  }

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
`;
}
