import { PropsWithChildren } from "react";
import useServerInsertedHTML from "ultra/hooks/use-server-inserted-html.js";
import { getCssText } from "./stitches.config.ts";

export function ThemeProvider({ children }: PropsWithChildren) {
  /**
   * useServerInsertedHTML will inject the returned output into the rendered stream.
   */
  useServerInsertedHTML(() => {
    return (
      <style
        id="stitches"
        dangerouslySetInnerHTML={{ __html: getCssText() }}
      >
      </style>
    );
  });

  return <>{children}</>;
}
