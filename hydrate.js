import { createElement as h, startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

/**
 * @see https://caniuse.com/requestidlecallback
 */
const requestIdleCallbackUltra = (typeof self !== "undefined" &&
  self.requestIdleCallback &&
  self.requestIdleCallback.bind(window)) ||
  function (cb) {
    const start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

/**
 * @param {Element | Document} container
 * @param {React.ReactNode} element
 * @param {import('react-dom/client').HydrationOptions} [options]
 */
export default function hydrate(container, element, options) {
  requestIdleCallbackUltra(() => {
    /**
     * @see https://reactjs.org/docs/react-api.html#starttransition
     */
    startTransition(() => {
      hydrateRoot(
        container,
        h(StrictMode, { children: element }),
        options,
      );
    });
  });
}
