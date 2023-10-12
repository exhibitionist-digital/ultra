import { createElement as h, Fragment } from "react";

/**
 * @typedef {Object} UltraServerProps
 * @property {Request} [request]
 * @property {import('react').ReactNode} [children]
 */

/**
 * @param {UltraServerProps} props
 */
export default function UltraServer({ request, children }) {
  return h(Fragment, undefined, [children]);
}
