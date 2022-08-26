// import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { runSync } from "@mdx-js/run";
import * as runtime from "react/jsx-runtime";

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
  return (
    <>
      <section className={`page ${page}`}>
        <Content />
      </section>
    </>
  );
}
