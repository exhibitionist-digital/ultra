import useAsset from "ultra/hooks/use-asset.js";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./home.tsx"));
const Counter = lazy(() => import("./counter.tsx"));
const Tailwind = lazy(() => import("./tailwind.tsx"));

export default function App({ inspected = "", pathname = "/" }) {
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

          {(() => {
            switch (pathname) {
              case "/":
                return <Home inspected={inspected} />;
              case "/hydration":
                return <Counter />;
              case "/tw":
                return <Tailwind />;
              default:
                return <h2>404</h2>;
            }
          })()}
        </main>
      </body>
    </html>
  );
}
