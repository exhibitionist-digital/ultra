import {
  createElement as h,
  Fragment,
  startTransition,
  useContext,
} from "react";
import { hydrateRoot } from "react-dom/client";
import UltraServerContext from "./context.js";

/**
 * @typedef {Object} UltraClientProps
 * @property {import('react').ReactNode} [children]
 */

/**
 * @param {UltraClientProps} props
 */
export default function UltraClient({ children }) {
  return h(Fragment, undefined, children);
}

/**
 * @param {Element | Document} container
 * @param {React.ReactNode} element
 * @param {import('react-dom/client').HydrationOptions} [options]
 */
export function hydrate(container, element, options) {
  const importMapScript = document.scripts.namedItem("importmap");
  const importMap = importMapScript
    ? JSON.parse(importMapScript.innerHTML)
    : {};

  requestIdleCallback(() => {
    startTransition(() => {
      hydrateRoot(
        container,
        h(UltraServerContext.Provider, {
          value: { importMap },
          children: element,
        }),
        options,
      );
    });
  });
}

export function ImportMapScript() {
  const { importMap } = useContext(UltraServerContext);
  return h("script", {
    name: "importmap",
    type: "importmap",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(importMap),
    },
  });
}
