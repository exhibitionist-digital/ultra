import useFlushEffects from "ultra/hooks/use-flush-effects.js";
import { getCssText } from "./stitches.config.js";

export function StitchesProvider({ children }) {
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
