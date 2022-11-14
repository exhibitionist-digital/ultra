import { PropsWithChildren } from "react";
import { Sheet } from "twind";
import { getStyleTagProperties, VirtualSheet } from "twind/sheets";
import { sheet } from "./twind.ts";
import useServerInsertedHTML from "ultra/hooks/use-server-inserted-html.js";

/**
 * This is just a guard to make sure we are dealing with
 * a server side StyleSheet
 */
function isVirtualSheet(sheet: Sheet): sheet is VirtualSheet {
  return typeof Deno !== "undefined";
}

export function TwindProvider({ children }: PropsWithChildren) {
  /**
   * useServerInsertedHTML will inject the returned output into the rendered stream.
   */
  useServerInsertedHTML(() => {
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
