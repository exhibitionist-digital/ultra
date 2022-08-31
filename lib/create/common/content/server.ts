import { Config } from "../config.ts";
import { printer } from "../printer.ts";

export function serverContent(config: Config) {
  const p = printer(config);

  return `
import { serve } from "https://deno.land/std@0.153.0/http/server.ts";
import { createServer, createRouter } from "ultra/server.ts";
import App from "./src/app${config.ts ? '.tsx':'.jsx'}";

${p.twind(`
// Twind
import { TwindProvider, sheet } from "create-ultra-app/twind";
import "./twind${config.ts ? ".ts" : ".js"}";
`)}
${p.stitches(`
// Stitches
import { StitchesProvider } from 'create-ultra-app/stitches'
import { getCssText } from "./stitches.config${config.ts ? '.ts' : '.js'}";
`)}
${p.reactRouter(`
// React Router
import { StaticRouter } from "react-router-dom/server";
`)}
${p.wouter(`
// Wouter
import { Router } from 'wouter'
import staticLocationHook from 'wouter/static-location'
import { SearchParamsProvider } from "create-ultra-app/wouter"
`)}
${p.reactHelmetAsync(`// Helmet
import { HelmetProvider } from 'react-helmet-async'
import useFlushEffects from 'ultra/hooks/use-flush-effects.js'
// deno-lint-ignore no-explicit-any
${config.ts ? 'const helmetContext: Record<string, any> = {}' : 'const helmetContext = {}' }
`)}
${p.reactQuery(`// React Query
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient${config.ts ? '.ts' : '.js'}'
`)}
${p.trpc(`// tRPC
import { useState } from 'react'
import { trpc } from './src/trpc/client.ts'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './src/trpc/router.ts'
`)}


const server = await createServer({
   importMapPath: import.meta.resolve("./importMap.json"),
   browserEntrypoint: import.meta.resolve("./client.tsx"),
});


${config.ts ? 'function ServerApp({context}: any){':'function ServerApp({context}){'}

${p.trpc(`
const [queryClientTrpc] = useState(queryClient)
const [trpcClient] = useState(() =>
  trpc.createClient({
    url: 'http://localhost:8000/trpc',
  })
)
`)}

${p.reactHelmetAsync(`
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
`)}
const requestUrl = new URL(context.req.url)

return (

${p.reactHelmetAsync('<HelmetProvider context={helmetContext}>')}
${p.trpc('<trpc.Provider client={trpcClient} queryClient={queryClientTrpc}>')}
${p.reactQuery(`<QueryClientProvider client={queryClient${p.trpc('Trpc')}}>`)}
${p.stitches('<StitchesProvider cssText={getCssText}>')}
${p.twind('<TwindProvider sheet={sheet}>')}
${p.reactRouter('<StaticRouter location={requestUrl.pathname}>')}
${p.wouter('<Router hook={staticLocationHook(requestUrl.pathname)}>')}
${p.wouter('<SearchParamsProvider value={requestUrl.searchParams}>')}

<App />

${p.wouter('</SearchParamsProvider>')}
${p.wouter('</Router>')}
${p.reactRouter('</StaticRouter>')}
${p.twind('</TwindProvider>')}
${p.stitches('</StitchesProvider>')}
${p.reactQuery('</QueryClientProvider>')}
${p.trpc('</trpc.Provider>')}
${p.reactHelmetAsync('</HelmetProvider>')}
)
}

${p.trpc(`
const trpcServer = createRouter()

trpcServer.get('*', async context => {
	return await fetchRequestHandler({
		endpoint: '/trpc',
		req: context.req,
		router: appRouter,
		createContext: () => ({}),
	})
})
server.route('/trpc', trpcServer)
`)}

server.get("*", async (context) => {
  ${p.reactQuery('queryClient.clear()')}
   /**
   * Render the request
   */
   const result = await server.render(<ServerApp context={context} />);

   return context.body(result, 200, {
      "content-type": "text/html",
   });
});

serve(server.fetch);
`;
}
