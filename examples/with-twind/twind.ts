import { cssomSheet, setup } from "twind";
import { virtualSheet } from "twind/sheets";

/**
 * Depending on if we are running server side (Deno) or on the browser
 * we construct a VirtualSheet OR a CSSStyleSheet which will be populated
 * with the injected CSSStyleSheet from the injected style tag below.
 */
export const sheet = typeof Deno !== "undefined" ? virtualSheet() : cssomSheet({
  target: (document.getElementById("__twind") as HTMLStyleElement).sheet ||
    undefined,
});

/**
 * Your theme configuration for twind
 */
const theme = {};

setup({ sheet, theme });
