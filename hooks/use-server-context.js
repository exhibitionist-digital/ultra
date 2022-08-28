import { useContext } from "react";
import ServerContext from "./server-context.js";

/**
 * @callback contextCallback
 * @param {import('../lib/types.ts').Context} context
 * @returns {void}
 */

/**
 * @param {contextCallback | undefined} callback
 */
export default function useServerContext(callback) {
  const context = useContext(ServerContext);
  if (context && callback) {
    callback(context);
  }
}
