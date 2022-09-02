import { createElement as h, Fragment, Suspense, useContext } from "react";
import IslandContext from "./island-context.js";

export default function island(Component) {
  return function IslandComponent(props) {
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
}
