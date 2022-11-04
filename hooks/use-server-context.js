import { useContext } from "react";
import ServerContext from "./server-context.js";

/**
 * @callback contextCallback
 * @param {import('../lib/types.ts').Context} context
 * @returns {Response | void}
 */

/**
 * @param {contextCallback | undefined} callback
 */
export default function useServerContext(callback) {
  const context = useContext(ServerContext);
  if (context && callback) {
    const response = callback(context);
    if (response) {
      /**
       * TODO(deckchairlabs) how to set the response here, while keeping the server rendered markup
       * if desired
       */
    }
  }
}
