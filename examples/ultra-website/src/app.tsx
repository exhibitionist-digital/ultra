import { useEffect } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import { Link, Route, Switch, useLocation } from "wouter";
import HomePage from "./components/Home.tsx";
import Markdown from "./components/Markdown.tsx";
import { Suspense } from "react";
import GitHub from "./components/Github.tsx";

export default function App() {
  const [pathname] = useLocation();

  // scroll to top of page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // rm service works for now
  useEffect(() => {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (const registration of registrations) {
        registration.unregister();
        location.reload();
      }
    });
  });

  // smooth scroll
  const top = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Ultra: The Quest for Zero-Legacy</title>
        <meta
          name="description"
          content="Hypermodern Zero-Legacy Deno/React Framework"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="preload" as="style" href={useAsset("/style.css")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ultrajs.dev/" />
        <meta property="og:title" content="Ultra: The Quest for Zero-Legacy" />
        <meta
          property="og:description"
          content="Hypermodern Zero-Legacy Deno/React Framework"
        />
        <meta property="og:image" content="https://ultrajs.dev/share.webp" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ultrajs.dev/" />
        <meta
          property="twitter:title"
          content="Ultra: The Quest for Zero-Legacy"
        />
        <meta
          property="twitter:description"
          content="Hypermodern Zero-Legacy Deno/React Framework"
        />
        <meta
          property="twitter:image"
          content="https://ultrajs.dev/share.webp"
        />
      </head>
      <body>
        <main>
          <div className="top">
            <Link href="/" className="logo">
              <Ultra />
              <span>Ultra</span>
            </Link>
            <GitHub />
          </div>
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
          <button className="lil-ultra" onClick={top}>
            <span></span>__<span></span>
          </button>
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
