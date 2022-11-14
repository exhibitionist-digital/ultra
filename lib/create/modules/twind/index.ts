import type { Config } from "../../common/config.ts";

export function twindContent(config: Config) {
  return `
import { cssomSheet, setup, Configuration } from "twind";
import { virtualSheet } from "twind/sheets";

/**
 * Depending on if we are running server side (Deno) or on the browser
 * we construct a VirtualSheet OR a CSSStyleSheet which will be populated
 * with the injected CSSStyleSheet from the injected style tag below.
 */

${
    config.ts
      ? `
export const sheet = typeof Deno !== "undefined" ? virtualSheet() : cssomSheet({
   target: (document.getElementById("__twind") as HTMLStyleElement).sheet ||
     undefined,
 });
`
      : `
export const sheet = typeof Deno !== "undefined" ? virtualSheet() : cssomSheet({
   target: document.getElementById("__twind").sheet ||
     undefined,
 });
`
  }


/**
 * Twind configuration 
 */
const config: Configuration = {
  sheet,
  /**
   * Your theme configuration for twind
   */
  theme: {
    extend: {}
  },
  /**
   * Your plugins
   */
  plugins: {}
};

setup(config);
`;
}

export function twindProviderContent(config: Config) {
  return `
   ${config.ts ? 'import { PropsWithChildren } from "react";' : ""}
   import { Sheet } from "twind";
   import { getStyleTagProperties, VirtualSheet } from "twind/sheets";
   import { sheet } from "./twind${config.ts ? ".ts" : ".js"}";
   import useServerInsertedHTML from "ultra/hooks/use-server-inserted-html.js";
   
   /**
    * This is just a guard to make sure we are dealing with
    * a server side StyleSheet
    */
   ${
    config.ts
      ? "function isVirtualSheet(sheet: Sheet): sheet is VirtualSheet {"
      : "function isVirtualSheet(sheet){"
  }
     return typeof Deno !== "undefined";
   }

   export function TwindProvider({ children }${
    config.ts ? ": PropsWithChildren" : ""
  }) {
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
   `;
}
