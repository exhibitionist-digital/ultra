import { useContext, useId } from "react";
import DataStreamContext from "./data-stream-context.js";

/**
 * @template T
 * @param {() => Promise<T>} callback
 * @param {boolean} [ssrOnly=true] - Whether to only use the server side resolved data or not
 * @returns {callback}
 */
export default function useAsync(callback, ssrOnly = true) {
  const id = useId();
  const key = `ultra-async-data-stream-${id}`;
  const addDataStreamCallback = useContext(DataStreamContext);

  if (addDataStreamCallback) {
    addDataStreamCallback(key, callback);
    return callback;
  } else {
    try {
      const element = document.getElementById(key);
      if (element && ssrOnly) {
        return function resolvedCallback() {
          return JSON.parse(element.innerText);
        };
      } else {
        return callback;
      }
    } catch (error) {
      console.error(error);
      return callback;
    }
  }
}
