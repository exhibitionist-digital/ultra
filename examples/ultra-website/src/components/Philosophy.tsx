import { MDXProvider } from "@mdx-js/react";

import Content from "../content/philosophy.js";

export default function Markdown() {
  return (
    <MDXProvider>
      <section className={`page philosophy`}>
        <Content />
      </section>
    </MDXProvider>
  );
}
