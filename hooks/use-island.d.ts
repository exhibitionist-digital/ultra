import type { ComponentType, FunctionComponent } from "react";

type HydrationStrategy = "visible" | "load" | "idle";

export default function useIsland<T>(
  Component: ComponentType<T> & { url: string },
): FunctionComponent<
  T & { hydrationStrategy?: HydrationStrategy }
>;
