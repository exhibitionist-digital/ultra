import { MDXProvider } from "@mdx-js/react";

import Content from "../mdx/docs.js";

export default function Markdown() {
  return (
    <MDXProvider>
      <section className={`page docs`}>
        <Content />
      </section>
    </MDXProvider>
  );
}
