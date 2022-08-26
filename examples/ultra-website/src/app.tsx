import { useEffect } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import { Link, Route, Switch, useLocation } from "wouter";
import HomePage from "./pages/Home.tsx";
import Markdown from "./pages/Markdown.tsx";
import { Suspense } from "react";

export default function App() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Ultra: The Quest for Zero-Legacy</title>
        <meta
          name="description"
          content="Hypermodern Zero-Legacy Deno/React Framework"
        />
        <meta property="og:image" content="https://u2.fly.dev/share.webp" />
        <meta
          property="twitter:image"
          content="https://u2.fly.dev/share.webp"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="preload" as="style" href={useAsset("/style.css")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />
      </head>
      <body>
        <main>
          <Link href="/" className="logo">
            <Ultra />
            <span>Ultra</span>
          </Link>
          <nav>
            <Link href="/philosophy">
              Philosophy
            </Link>
            <Link href="/docs">
              Docs
            </Link>
          </nav>

          <Switch>
            <Route path="/">
              <Suspense fallback={null}>
                <HomePage />
              </Suspense>
            </Route>
            <Route path="/philosophy">
              <Suspense fallback={null}>
                <Markdown page="philosophy" />
              </Suspense>
            </Route>
            <Route path="/docs">
              <Suspense fallback={null}>
                <Markdown page="docs" />
              </Suspense>
            </Route>
            <Route>
              404
            </Route>
          </Switch>
          <div className="lil-ultra">
            <span></span>__<span></span>
          </div>
        </main>
      </body>
    </html>
  );
}

const Ultra = () => {
  return (
    <svg
      fill="none"
      height="440"
      viewBox="0 0 440 440"
      width="440"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path d="m225 95-82 135.135 82-99.662v214.527l72-114.865z" />
        <path d="m144 230 81 114-15-167z" />
      </g>
    </svg>
  );
};
