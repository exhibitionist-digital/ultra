import { Config } from "../config.ts";
import { fileExtension } from "../io.ts";
import { printer } from "../printer.ts";

export function clientContent(config: Config) {
  const p = printer(config);
  const ext = fileExtension(config);

  return `
import { hydrateRoot } from "react-dom/client";
import App from "${ext('./src/app', true)}";

${
    p.twind(`// Twind
import "${ext('./src/twind/twind', false)}";
`)
  }

${
    p.reactRouter(`// React Router
import { BrowserRouter } from "react-router-dom";
`)
  }

${
    p.wouter(`// Wouter
import { Router } from "wouter";
import { SearchParamsProvider } from "${ext('./src/wouter/index', true)}";
`)
  }

${p.reactHelmetAsync('import { HelmetProvider } from "react-helmet-async";')}

${
    p.reactQuery(`// React Query
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "${ext('./src/react-query/query-client', false)}";
${config.ts ? "declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;" : ""}
`)
  }

function ClientApp(){

return (

${p.reactHelmetAsync("<HelmetProvider>")}
${
    p.reactQuery(`
<QueryClientProvider client={queryClient}>
<Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>
`)
  }
${p.reactRouter("<BrowserRouter>")}
${
    p.wouter(`
<Router>
<SearchParamsProvider value={new URLSearchParams(window.location.search)}>
`)
  }

<App />

${p.wouter("</SearchParamsProvider></Router>")}
${p.reactRouter("</BrowserRouter>")}
${p.reactQuery("</Hydrate></QueryClientProvider>")}
${p.reactHelmetAsync("</HelmetProvider>")}

)
}

hydrateRoot(document, <ClientApp />)
`;
}
