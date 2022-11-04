import { useContext, useId } from "react";
import DataStreamContext from "./data-stream-context.js";

/**
 * @typedef {Object} Options
 * @property {boolean} [returnCallback=false] Should the streamed data or callback be returned on the client.
 * @property {number} [streamTimeout=5000] How long to wait for the stream to finish before returning a rejected promise.
 */

/**
 * @template T
 * @param {() => Promise<T>} callback A function that returns a promise. On the server, this function will be called and the result streamed to the client.
 * @param {Options} Options
 * @returns {callback}
 */

export default function useAsync(
  callback,
  { returnCallback = false, streamTimeout = 5000 } = {},
) {
  const id = useId();
  const key = `ultra-async-data-stream-${id}`;
  const addDataStreamCallback = useContext(DataStreamContext);

  if (addDataStreamCallback) {
    addDataStreamCallback(key, callback);
    return callback;
  } else {
    try {
      if (returnCallback) {
        return callback;
      }

      const element = document.getElementById(key);
      // If the element doesn't exist, the data hasn't streamed in yet.
      // Let's wait for the data to stream in.
      if (!element) {
        return function awaitStream() {
          return new Promise((resolve, reject) => {
            let timeout;
            function mutationCallback(_list, observer) {
              const element = document.getElementById(key);
              if (element) {
                clearTimeout(timeout);
                observer.disconnect();
                resolve(JSON.parse(element.innerText));
              }
            }
            const mutationObserver = new MutationObserver(mutationCallback);
            mutationObserver.observe(document.body, {
              childList: true,
              subtree: true,
            });
            // If the data hasn't streamed in after the timeout, we'll reject the promise.
            // If streamTimeout === 0, the promise never rejects.
            if (streamTimeout !== 0) {
              timeout = setTimeout(() => {
                mutationObserver.disconnect();
                reject();
              }, streamTimeout);
            }
          });
        };
        // We have data, lets return it.
      } else {
        return function resolvedCallback() {
          return Promise.resolve(JSON.parse(element.innerText));
        };
      }
    } catch (error) {
      console.error(error);
      // Lets return the callback if we can
      if (returnCallback) {
        return callback;
      }
      // Or else just return a function that rejects with the error.
      return function reject() {
        return Promise.reject(error);
      };
    }
  }
}
