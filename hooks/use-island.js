import { createElement as h, Fragment, useContext } from "react";
import IslandContext from "./island-context.js";

/**
 * @template Props
 * @param {React.ComponentType<Props> & { url: string }} Component
 * @returns {React.FunctionComponent<Props>}
 */
export default function island(Component) {
  if (!Component.url) {
    throw new Error("An island component must have a static url.");
  }

  const IslandComponent = function (props) {
    const add = useContext(IslandContext);
    const id = add(Component, props);

    const WrappedComponent = h(Fragment, null, [
      h("script", {
        key: "island-hydration-marker",
        type: "application/hydration-marker",
        "data-id": id,
      }),
      h(Component, { key: "island-suspense-boundary", ...props }),
    ]);

    return WrappedComponent;
  };

  IslandComponent.displayName = `Island(${
    Component.displayName || Component.name
  })`;

  return IslandComponent;
}
