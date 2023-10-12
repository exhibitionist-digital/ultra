import { createElement as h, Fragment } from "react";

/**
 * @typedef {Object} UltraBrowserProps
 * @property {import('react').ReactNode} [children]
 */

/**
 * @param {UltraBrowserProps} props
 */
export default function UltraBrowser({ children }) {
  return h(Fragment, undefined, children);
}
