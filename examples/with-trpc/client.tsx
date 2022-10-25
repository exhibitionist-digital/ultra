import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import { trpc } from "./src/trpc/trpc.ts";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/query-client.tsx";
declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

import { trpcClient } from "./src/trpc/client.ts";

hydrate(
  document,
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>
        <App />
      </Hydrate>
    </QueryClientProvider>
  </trpc.Provider>,
);
