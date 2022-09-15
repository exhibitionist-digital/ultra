import type { ReactNode } from "react";
import { createElement as h, Fragment, useCallback } from "react";
import { renderToString } from "react-dom/server";
import FlushEffectsContext from "../../hooks/flush-effect-context.js";

const flushEffectsCallbacks: Set<() => ReactNode> = new Set();

export function FlushEffectsProvider({ children }: { children: JSX.Element }) {
  // Reset flushEffectsHandler on each render
  flushEffectsCallbacks.clear();

  const addFlushEffects = useCallback(
    (handler: () => ReactNode) => {
      flushEffectsCallbacks.add(handler);
    },
    [],
  );

  return (
    h(FlushEffectsContext.Provider, { value: addFlushEffects }, children)
  );
}

export const flushEffectHandler = (): string => {
  return renderToString(
    h(
      Fragment,
      null,
      Array.from(flushEffectsCallbacks).map((callback) => callback()),
    ),
  );
};
