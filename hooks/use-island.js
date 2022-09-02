import { createElement as h, Fragment, Suspense, useContext } from "react";
import IslandContext from "./island-context.js";

/**
 * @param {React.ComponentType<T> & { url: string }} Component
 */
export default function island(Component) {
  if (!Component.url) {
    throw new Error("An island component must have a static url.");
  }

  // TODO: how to infer props with JSDoc of passed component?
  const IslandComponent = function (props) {
    const add = useContext(IslandContext);
    return h(Fragment, null, [
      h("script", {
        key: "hydration-marker",
        type: "application/hydration-marker",
        "data-id": add(Component, props),
      }),
      h(Suspense, { key: "suspense-boundary" }, h(Component, props)),
    ]);
  };

  return IslandComponent;
}
