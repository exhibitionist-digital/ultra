import { createElement as h } from "react";
import useFlushEffects from "./use-flush-effects.js";

/**
 * This hook will insert a `<link rel="preload" />` tag into the head of the
 * server render document. During client side transitions, this won't do anything.
 *
 * @param {string} href
 * @param {React.LinkHTMLAttributes<HTMLLinkElement>} props
 */
export default function usePreload(href, props) {
  useFlushEffects(() => {
    return h("link", {
      rel: "preload",
      href,
      ...props,
    });
  });

  return href;
}
