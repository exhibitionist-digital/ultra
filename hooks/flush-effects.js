import { createContext, useContext } from "react";

/**
 * @type {React.Context<null | (handler: () => React.ReactNode>)}
 */
export const FlushEffectsContext = createContext(
  null,
);

/**
 * @param {() => React.ReactNode} callback
 * @returns {void}
 */
export function useFlushEffects(callback) {
  const addFlushEffects = useContext(FlushEffectsContext);
  // Should have no effects on client where there's no flush effects provider
  if (addFlushEffects) {
    addFlushEffects(callback);
  }
}
