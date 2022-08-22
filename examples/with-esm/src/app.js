import { createElement as h } from "react";

export default function App() {
  return (
    h(
      "html",
      null,
      h(
        "head",
        null,
        h(
          "title",
          null,
          "Basic",
        ),
      ),
      h(
        "body",
        null,
        h(
          "div",
          null,
          "Hello with-esm!",
        ),
      ),
    )
  );
}
