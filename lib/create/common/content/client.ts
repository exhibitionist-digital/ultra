import { Config } from "../config.ts";
import { printer } from "../printer.ts";

export function clientContent(config: Config) {
  const p = printer(config);
  
  return `
import { hydrateRoot } from "react-dom/client";
import App from "./src/app${config.ts ? '.tsx' : '.jsx'}";

${p.twind(`// Twind
import { TwindProvider, sheet } from "create-ultra-app/twind";
import "./twind${config.ts ? ".ts" : ".js"}";
`)}
${p.stitches(`// Stitches
import { StitchesProvider } from 'create-ultra-app/stitches'
import { getCssText } from "./stitches.config${config.ts ? '.ts' : '.js'}";
`)}
${p.reactRouter(`// React Router
import { BrowserRouter } from "react-router-dom";
`)}
${p.reactHelmetAsync(`// Helmet
import { HelmetProvider } from 'react-helmet-async';
`)}
${p.reactQuery(`// React Query
import { Hydrate, QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient.ts'
${config.ts ? 'declare const __REACT_QUERY_DEHYDRATED_STATE: unknown' : ''}
`)}
${p.trpc(`
import { useState } from 'react'
import { trpc } from './src/trpc/client.ts'
`)}

function ClientApp(){

${p.trpc(`// tRPC
const [queryClientTrpc] = useState(queryClient)
const [trpcClient] = useState(() =>
  trpc.createClient({
    url: 'http://localhost:8000/trpc',
  })
)
`)}

return (

${p.reactHelmetAsync('<HelmetProvider>')}
${p.trpc('<trpc.Provider client={trpcClient} queryClient={queryClientTrpc}>')}
${p.reactQuery(`<QueryClientProvider client={queryClient${p.trpc('Trpc')}}>`)}
${p.reactQuery('<Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>')}
${p.twind('<TwindProvider sheet={sheet}>')}
${p.stitches('<StitchesProvider cssText={getCssText}>')}
${p.reactRouter('<BrowserRouter>')}

<App />

${p.reactRouter('</BrowserRouter>')}
${p.stitches('</StitchesProvider>')}
${p.twind('</TwindProvider>')}
${p.reactQuery('</Hydrate>')}
${p.reactQuery('</QueryClientProvider>')}
${p.trpc('</trpc.Provider>')}
${p.reactHelmetAsync('</HelmetProvider>')}

)
}

hydrateRoot(document, <ClientApp />)
`;
}
