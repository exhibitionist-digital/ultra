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

// Note: If storing formatted HTML in your dehydrated state, it will need to be escaped, examples below.
// https://github.com/exhibitionist-digital/ultra/issues/134
// https://github.com/jaydenseric/ruck/blob/da7fb7d445128c22a32bd2f1fbf6fd5e1bc12886/jsonToRawHtmlScriptValue.mjs
// https://github.com/vercel/next.js/blob/0af3b526408bae26d6b3f8cab75c4229998bf7cb/packages/next/server/htmlescape.ts
// https://github.com/zertosh/htmlescape
