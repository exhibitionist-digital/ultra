import { createElement as h, Fragment, useContext } from "react";
import IslandContext from "./island-context.js";

/**
 * @template Props
 * @param {React.ComponentType<Props> & { url: string }} Component
 * @returns {React.FunctionComponent<Props & { hydrationStrategy?: 'visible' | 'load' | 'idle' }>}
 */
export default function island(Component) {
  const name = Component.displayName || Component.name;

  if (!Component.url) {
    throw new Error(
      `An island component must have a static url defined. Add "${name}.url = import.meta.url;" to your island component.`,
    );
  }

  const IslandComponent = function ({ hydrationStrategy, ...props }) {
    const add = useContext(IslandContext);
    const id = add(Component, props);

    const WrappedComponent = h(Fragment, null, [
      h("template", {
        key: `island-hydration-marker-${id}`,
        "data-hydration-marker": id,
        "data-hydration-strategy": hydrationStrategy,
      }),
      h(Component, { key: `island-suspense-boundary-${id}`, ...props }),
    ]);

    return WrappedComponent;
  };

  IslandComponent.displayName = `Island(${name})`;

  return IslandComponent;
}
