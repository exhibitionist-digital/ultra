import { createElement as h } from "react";
import useServerInsertedHTML from "./use-server-inserted-html.js";

/**
 * This hook will insert a `<link rel="preload" />` tag into the head of the
 * server render document. During client side transitions, this won't do anything.
 *
 * @param {string} href
 * @param {React.LinkHTMLAttributes<HTMLLinkElement>} props
 */
export default function usePreload(href, props) {
  useServerInsertedHTML(() => {
    return h("link", {
      rel: "preload",
      href,
      ...props,
    });
  });

  return href;
}
