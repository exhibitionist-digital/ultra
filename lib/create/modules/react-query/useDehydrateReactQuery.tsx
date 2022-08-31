import { dehydrate, QueryClient } from "@tanstack/react-query";
import useFlushEffects from "ultra/hooks/use-flush-effects.js";

export function useDehydrateReactQuery(queryClient: QueryClient) {
  useFlushEffects(() => {
    /**
     * Dehydrate the state from queryClient
     */
    const dehydratedState = dehydrate(queryClient);

    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__REACT_QUERY_DEHYDRATED_STATE = ${
            JSON.stringify(dehydratedState)
          }`,
        }}
      >
      </script>
    );
  });
}

// Note: There are known limitations to `dehydrate`, more info here.
// https://github.com/TanStack/query/blob/main/docs/reference/hydration.md#limitations
