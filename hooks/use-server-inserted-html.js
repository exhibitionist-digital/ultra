import { useContext } from "react";
import ServerInsertedHTMLContext from "./server-inserted-html-context.js";

/**
 * @param {() => React.ReactNode} callback
 * @returns {void}
 */
export default function useServerInsertedHTML(callback) {
  const addInsertedServerHTMLCallback = useContext(ServerInsertedHTMLContext);
  // Should have no effects on client where there's no flush effects provider
  if (addInsertedServerHTMLCallback) {
    addInsertedServerHTMLCallback(callback);
  }
}
