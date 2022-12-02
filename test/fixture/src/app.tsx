import { lazy, Suspense } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import Post from "./components/Post.tsx";

const LazyPost = lazy(() => import("./components/Post.tsx"));

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>basic</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="preload" as="style" href={useAsset("/style.css")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />
      </head>
      <body>
        <main>
          <h1>
            <span></span>__<span></span>
          </h1>
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
            customize your routing, data fetching, and styling with popular
            libraries.
          </p>
          <Suspense>
            <Post id={1} />
            <Post id={2} />
            <Post id={3} />
            <LazyPost id={4} />
          </Suspense>
        </main>
      </body>
    </html>
  );
}
