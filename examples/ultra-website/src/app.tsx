import { Suspense, useEffect, useRef } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import { Link, Route, Switch, useLocation } from "wouter";
import HomePage from "./components/Home.tsx";
import Philosophy from "./components/Philosophy.tsx";
import { DocsLayout } from "./layout/Docs.tsx";

// Getting Started
import KnowledgeBase from "./content/docs/knowledge-base.js";
import Prerequisites from "./content/docs/prerequisites.js";
import CreateProject from "./content/docs/create-project.js";
import Routing from "./content/docs/routing.js";
import Middleware from "./content/docs/middleware.js";
import Styling from "./content/docs/styling.js";
import DataFetching from "./content/docs/data-fetching.js";
import CodeSplitting from "./content/docs/code-splitting.js";
import Building from "./content/docs/building.js";
// Hooks
import Hooks from "./content/docs/hooks.js";
import UseAssetHook from "./content/docs/use-asset.js";
import UseAsyncHook from "./content/docs/use-async.js";
import UseEnvHook from "./content/docs/use-env.js";
import UseIslandHook from "./content/docs/use-island.js";
import UsePreloadHook from "./content/docs/use-preload.js";
import UseServerContextHook from "./content/docs/use-server-context.js";

import UseServerInsertedHTMLHook from "./content/docs/use-server-inserted-html.js";

// Deployment
import DenoDeploy from "./content/docs/deno-deploy.js";
import Fly from "./content/docs/fly.js";

export default function App() {
  const [pathname] = useLocation();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) top();
    else hasMounted.current = true;
  }, [pathname]);

  const top = () => {
    globalThis.scroll({
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
        <Title />
        <main>
          <DocsLayout>
            <Suspense>
              <Switch>
                <Route path="/">
                  <HomePage />
                </Route>
                <Route path="/philosophy">
                  <Philosophy />
                </Route>
                <Route path="/knowledge-base">
                  <KnowledgeBase />
                </Route>
                {/* Getting Started */}
                <Route path="/prerequisites">
                  <Prerequisites />
                </Route>
                <Route path="/create-project">
                  <CreateProject />
                </Route>
                <Route path="/routing">
                  <Routing />
                </Route>
                <Route path="/middleware">
                  <Middleware />
                </Route>
                <Route path="/styling">
                  <Styling />
                </Route>
                <Route path="/data-fetching">
                  <DataFetching />
                </Route>
                <Route path="/code-splitting">
                  <CodeSplitting />
                </Route>
                <Route path="/building-for-deployment">
                  <Building />
                </Route>
                {/* Deploy */}
                <Route path="/deploy">
                  <NotFound />
                </Route>
                <Route path="/deno-deploy">
                  <DenoDeploy />
                </Route>
                <Route path="/fly-docker">
                  <Fly />
                </Route>
                {/* Hooks */}
                <Route path="/hooks">
                  <Hooks />
                </Route>
                <Route path="/use-asset">
                  <UseAssetHook />
                </Route>
                <Route path="/use-async">
                  <UseAsyncHook />
                </Route>
                <Route path="/use-env">
                  <UseEnvHook />
                </Route>
                <Route path="/use-island">
                  <UseIslandHook />
                </Route>
                <Route path="/use-preload">
                  <UsePreloadHook />
                </Route>
                <Route path="/use-server-context">
                  <UseServerContextHook />
                </Route>
                <Route path="/use-server-inserted-html">
                  <UseServerInsertedHTMLHook />
                </Route>
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Suspense>
          </DocsLayout>
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

const Header = () => {
  return (
    <header id="site-header">
      <Link href="/">
        <a>
          <Ultra />
        </a>
      </Link>
      <nav id="site-nav">
        <Link href="/docs">
          Docs
        </Link>
        <a
          href="https://discord.com/invite/XDC5WxGHb2"
          target="_blank"
        >
          Discord
        </a>
      </nav>
      {/* <GitHub /> */}
    </header>
  );
};

const Ultra = () => {
  return (
    <svg
      className="logo"
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

const NotFound = () => {
  return (
    <>
      <h1>Not Found</h1>
      <p>
        Hey there, sorry about this, we're probably still working on this
        section of the documentation. Join our{" "}
        <a href="https://discord.com/invite/XDC5WxGHb2" target="_blank">
          Discord
        </a>{" "}
        if you haven't already so we can keep you updated!
      </p>
    </>
  );
};

export { Ultra };
