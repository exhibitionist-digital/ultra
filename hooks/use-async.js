import { useContext, useId } from "react";
import DataStreamContext from "./data-stream-context.js";

/**
 * @template T
 * @param {() => Promise<T>} callback
 * @returns {callback}
 */
export default function useAsync(callback) {
  const id = useId();
  const key = `ultra-async-data-stream-${id}`;
  const addDataStreamCallback = useContext(DataStreamContext);

  if (addDataStreamCallback) {
    addDataStreamCallback(key, callback);
    return callback;
  } else {
    try {
      const element = document.getElementById(key);
      if (element) {
        return function resolvedCallback() {
          return Promise.resolve(JSON.parse(element.innerText));
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
