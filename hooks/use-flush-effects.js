import { useContext } from "react";
import FlushEffectsContext from "./flush-effect-context.js";

/**
 * @param {() => React.ReactNode} callback
 * @returns {void}
 */
export default function useFlushEffects(callback) {
  const addFlushEffects = useContext(FlushEffectsContext);
  // Should have no effects on client where there's no flush effects provider
  if (addFlushEffects) {
    addFlushEffects(callback);
  }
}
