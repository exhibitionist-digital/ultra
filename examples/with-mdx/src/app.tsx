import { useQuery } from "@tanstack/react-query";
import { runSync } from "@mdx-js/run";
import * as runtime from "react/jsx-runtime";

export default function App() {
  // grab dynamic mdx data
  const docs = useQuery(["docs"], async () => {
    return await fetch(
      `/api/docs`,
    ).then((response) => response.json());
  });
  // parse data
  const { default: Content } = runSync(
    JSON.parse(docs?.data)?.content,
    runtime,
  );
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>With with-mdx</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <Content />
      </body>
    </html>
  );
}
