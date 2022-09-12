import { useContext, useId } from "react";
import DataStreamContext from "./data-stream-context.js";

/**
 * @template T
 * @param {Promise<T>} promise
 * @returns {Promise<T>}
 */
export default function useAsync(promise) {
  const id = useId();
  const key = `ultra-async-data-stream-${id}`;
  const addDataPromise = useContext(DataStreamContext);

  if (addDataPromise) {
    addDataPromise(key, promise);
    return promise;
  } else {
    try {
      const element = document.getElementById(key);
      if (element) {
        return Promise.resolve(JSON.parse(element.innerText));
      } else {
        return promise;
      }
    } catch (error) {
      console.error(error);
      return promise;
    }
  }
}
