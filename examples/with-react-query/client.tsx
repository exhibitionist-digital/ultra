import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import { queryClient } from "./src/query-client.ts";

declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

hydrate(
  document,
  <QueryClientProvider client={queryClient}>
    <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>
      <App />
    </Hydrate>
  </QueryClientProvider>,
);
