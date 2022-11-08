import { useEffect, useRef } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import { Link, Route, Switch, useLocation } from "wouter";
import HomePage from "./components/Home.tsx";
import Docs from "./components/Docs.tsx";
import Philosophy from "./components/Philosophy.tsx";
import GitHub from "./components/Github.tsx";
import { DocsLayout } from "./layout/Docs.tsx";

// Docs
import CreateProject from "./content/docs/create-project.js";
import UseAssetHook from "./content/docs/use-asset.js";
import UseAsyncHook from "./content/docs/use-async.js";
import UseEnvHook from "./content/docs/use-env.js";
import UseIslandHook from "./content/docs/use-island.js";
import UsePreloadHook from "./content/docs/use-preload.js";
import UseServerContextHook from "./content/docs/use-server-context.js";
import UseServerInsertedHTMLHook from "./content/docs/use-server-inserted-html.js";

export default function App() {
  const [pathname] = useLocation();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) window.scrollTo(0, 0);
    else hasMounted.current = true;
  }, [pathname]);

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
        <meta
          name="description"
          content="Zero-Legacy Deno/React Suspense SSR Framework"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="preload" as="style" href={useAsset("/styles/style.css")} />
        <link rel="stylesheet" href={useAsset("/styles/style.css")} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={"https://ultrajs.dev" + useAsset("/share.webp")}
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:image"
          content={"https://ultrajs.dev" + useAsset("/share.webp")}
        />
        <meta
          property="og:description"
          content="Zero-Legacy Deno/React Suspense SSR Framework"
        />
        <meta
          property="twitter:description"
          content="Zero-Legacy Deno/React Suspense SSR Framework"
        />
      </head>
      <body>
        <main>
          <div className="top">
            <Link href="/" className="logo">
              <Ultra />
              <span>Ultra</span>
            </Link>
            {/* <GitHub /> */}
          </div>
          <nav className="site-nav">
            <Link href="/philosophy">
              Philosophy
            </Link>
            <Link href="/docs">
              Docs
            </Link>
            <a href="https://discord.com/invite/XDC5WxGHb2" target="_blank">
              Discord
            </a>
          </nav>
          <Switch>
            <Route path="/">
              <Title />
              <HomePage />
            </Route>
            <Route path="/philosophy">
              <Title title="Ultra: 📖 Philosophy" />
              <Philosophy />
            </Route>
            <Route path="/docs/:section?">
              <Title title="Ultra: ⚙️ Docs" />
              <DocsLayout>
                <Switch>
                  <Route path="/docs">
                    <Docs />
                  </Route>
                  {/* Getting Started */}
                  <Route path="/docs/create-project">
                    <CreateProject />
                  </Route>
                  {/* Hooks */}
                  <Route path="/docs/use-asset">
                    <UseAssetHook />
                  </Route>
                  <Route path="/docs/use-async">
                    <UseAsyncHook />
                  </Route>
                  <Route path="/docs/use-env">
                    <UseEnvHook />
                  </Route>
                  <Route path="/docs/use-island">
                    <UseIslandHook />
                  </Route>
                  <Route path="/docs/use-preload">
                    <UsePreloadHook />
                  </Route>
                  <Route path="/docs/use-server-context">
                    <UseServerContextHook />
                  </Route>
                  <Route path="/docs/use-server-inserted-html">
                    <UseServerInsertedHTMLHook />
                  </Route>
                </Switch>
              </DocsLayout>
            </Route>
            <Route>
              404
            </Route>
          </Switch>
          <button className="lil-ultra" onClick={top}>
            <span></span>__<span></span>
          </button>
        </main>
        <script
          dangerouslySetInnerHTML={{
            __html:
              `if ("serviceWorker" in navigator && location.hostname === "ultrajs.dev") {
                navigator.serviceWorker.register("/service-worker.js");
              }`,
          }}
        />
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

const Title = ({ title = "Ultra: The Quest for Zero-Legacy" }) => {
  return (
    <>
      <title>{`${title}`}</title>
      <meta property="twitter:title" content={`${title}`} />
      <meta property="og:title" content={`${title}`} />
    </>
  );
};
