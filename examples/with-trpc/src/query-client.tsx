import { QueryClient, dehydrate } from "@tanstack/react-query";
import useServerInsertedHTML from "ultra/hooks/use-server-inserted-html.js";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

export function useDehydrateReactQuery(queryClient: QueryClient) {
  useServerInsertedHTML(() => {
    /**
     * Dehydrate the state from queryClient
     */
    const dehydratedState = dehydrate(queryClient);

    return (
      <script
        dangerouslySetInnerHTML={{
          __html: "window.__REACT_QUERY_DEHYDRATED_STATE = " +
            JSON.stringify(dehydratedState),
        }}
      >
      </script>
    );
  });
}

// Note: There are known limitations to 'dehydrate', more info here.
// https://github.com/TanStack/query/blob/main/docs/reference/hydration.md#limitations
