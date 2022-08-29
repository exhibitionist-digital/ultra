import { cssomSheet, Sheet } from "twind";
import {
  getStyleTagProperties,
  VirtualSheet,
  virtualSheet,
} from "twind/sheets";
import useFlushEffects from "ultra/hooks/use-flush-effects.js";

/**
 * This is just a guard to make sure we are dealing with
 * a server side StyleSheet
 */
function isVirtualSheet(sheet: Sheet): sheet is VirtualSheet {
  return typeof Deno !== "undefined";
}

interface TwindProviderProps {
  children: React.ReactNode;
  sheet: Sheet;
}

export function TwindProvider({ children, sheet }: TwindProviderProps) {
  /**
   * useFlushEffects will inject the returned output into the rendered stream.
   */
  useFlushEffects(() => {
    if (isVirtualSheet(sheet)) {
      const styleTag = getStyleTagProperties(sheet);
      sheet.reset();

      return (
        <style
          id={styleTag.id}
          dangerouslySetInnerHTML={{ __html: styleTag.textContent }}
        >
        </style>
      );
    }
  });

  return <>{children}</>;
}

export const sheet = typeof Deno !== "undefined" ? virtualSheet() : cssomSheet({
  target: (document.getElementById("__twind") as HTMLStyleElement).sheet ||
    undefined,
});
