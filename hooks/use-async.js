import { useContext } from "react";
import AsyncEffectContext from "./async-effect-context.js";

/**
 * @param {PromiseLike} promise
 * @returns {void}
 */
export default function useAsync(promise) {
  const addAsyncEffect = useContext(AsyncEffectContext);
  // Should have no effects on client where there's no async effects provider
  if (addAsyncEffect) {
    addAsyncEffect(promise);
  }
}
