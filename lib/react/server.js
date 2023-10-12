import { createElement as h, Fragment } from "react";
import UltraServerContext from "./context.js";

/**
 * @typedef {Object} UltraServerProps
 * @property {Request} [request]
 * @property {import('../importMap.ts').ImportMap} [importMap]
 * @property {import('react').ReactNode} [children]
 */

/**
 * @param {UltraServerProps} props
 */
export default function UltraServer({ request, importMap, children }) {
  return h(
    UltraServerContext.Provider,
    { value: { importMap } },
    h(Fragment, undefined, children),
  );
}
