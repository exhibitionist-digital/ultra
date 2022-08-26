// import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { runSync } from "@mdx-js/run";
import * as runtime from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";

export default function Markdown({ page }: { page: string }) {
  // grab dynamic mdx data
  const docs = useQuery([page], async () => {
    return await fetch(
      `/api/${page}`,
    ).then((response) => response.json());
  });
  // parse data
  const { default: Content } = runSync(
    docs?.data?.content,
    runtime,
  );
  const title = page.charAt(0).toUpperCase() + page.slice(1);
  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>Ultra: {title}</title>
        <meta property="og:title" content={`Ultra: ${title}`} />
        <meta property="twitter:title" content={`Ultra: ${title}`} />
      </Helmet>
      <section className={`page ${page}`}>
        <Content />
      </section>
    </>
  );
}
