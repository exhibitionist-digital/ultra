import { PropsWithChildren } from "react";
import { useFlushEffects } from "ultra/client.js";
import { getCssText } from "./stitches.config.ts";

export function ThemeProvider({ children }: PropsWithChildren) {
  /**
   * useFlushEffects will inject the returned output into the rendered stream.
   */
  useFlushEffects(() => {
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
