import * as React from "react";
import useAsset from "ultra/hooks/use-asset.js";

// deno-lint-ignore no-explicit-any
const use = (React as any)["experimental_use"];

export default function App() {
  const data = use(
    fetch("https://jsonplaceholder.typicode.com/todos/1").then((response) =>
      response.json()
    ),
  );
  console.log(data);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>react-experimental</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("./favicon.ico")} />
        <link rel="preload" as="style" href={useAsset("./style.css")} />
        <link rel="stylesheet" href={useAsset("./style.css")} />
      </head>
      <body>
        <main>
          <h1>
            <span></span>__<span></span>
          </h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <p>
            Welcome to{" "}
            <strong>Ultra</strong>. This is a barebones starter for your web
            app.
          </p>
          <p>
            Take{" "}
            <a
              href="https://ultrajs.dev/docs"
              target="_blank"
            >
              this
            </a>, you may need it where you are going. It will show you how to
            customise your routing, data fetching, and styling with popular
            libraries.
          </p>
        </main>
      </body>
    </html>
  );
}
