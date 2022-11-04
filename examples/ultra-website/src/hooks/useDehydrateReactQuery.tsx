import { dehydrate, QueryClient } from "@tanstack/react-query";
import useServerInsertedHTML from "ultra/hooks/use-server-inserted-html.js";

export function useDehydrateReactQuery(queryClient: QueryClient) {
  useServerInsertedHTML(() => {
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
