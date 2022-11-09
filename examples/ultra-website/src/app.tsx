import { lazy, Suspense, useEffect, useRef } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import { Link, Route, Switch, useLocation } from "wouter";
import HomePage from "./components/Home.tsx";
import Docs from "./components/Docs.tsx";
import Philosophy from "./components/Philosophy.tsx";
import GitHub from "./components/Github.tsx";
import { DocsLayout } from "./layout/Docs.tsx";

// Getting Started
const KnowledgeBase = lazy(() => import("./content/docs/knowledge-base.js"));
const Prerequisites = lazy(() => import("./content/docs/prerequisites.js"));
const CreateProject = lazy(() => import("./content/docs/create-project.js"));
const Routing = lazy(() => import("./content/docs/routing.js"));
const Middleware = lazy(() => import("./content/docs/middleware.js"));
const Styling = lazy(() => import("./content/docs/styling.js"));
const DataFetching = lazy(() => import("./content/docs/data-fetching.js"));
const CodeSplitting = lazy(() => import("./content/docs/code-splitting.js"));
const Building = lazy(() => import("./content/docs/building.js"));
// Hooks
const Hooks = lazy(() => import("./content/docs/hooks.js"));
const UseAssetHook = lazy(() => import("./content/docs/use-asset.js"));
const UseAsyncHook = lazy(() => import("./content/docs/use-async.js"));
const UseEnvHook = lazy(() => import("./content/docs/use-env.js"));
const UseIslandHook = lazy(() => import("./content/docs/use-island.js"));
const UsePreloadHook = lazy(() => import("./content/docs/use-preload.js"));
const UseServerContextHook = lazy(() =>
  import("./content/docs/use-server-context.js")
);
const UseServerInsertedHTMLHook = lazy(() =>
  import("./content/docs/use-server-inserted-html.js")
);
// Deployment
const DenoDeploy = lazy(() => import("./content/docs/deno-deploy.js"));
const Fly = lazy(() => import("./content/docs/fly.js"));

export default function App() {
  const [pathname] = useLocation();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) top();
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
          <Switch>
            <Route path="/">
              <Title />
              <Header />
              <HomePage />
            </Route>
            <Route path="/philosophy">
              <Title title="Ultra: 📖 Philosophy" />
              <DocsLayout>
                <Header />
                <Philosophy />
              </DocsLayout>
            </Route>
            <Route path="/docs/:section*">
              <Title title="Ultra: ⚙️ Docs" />
              <DocsLayout>
                <Header />
                <Suspense>
                  <Switch>
                    <Route path="/docs">
                      <Philosophy />
                    </Route>
                    <Route path="/docs/knowledge-base">
                      <KnowledgeBase />
                    </Route>
                    {/* Getting Started */}
                    <Route path="/docs/prerequisites">
                      <Prerequisites />
                    </Route>
                    <Route path="/docs/create-project">
                      <CreateProject />
                    </Route>
                    <Route path="/docs/routing">
                      <Routing />
                    </Route>
                    <Route path="/docs/middleware">
                      <Middleware />
                    </Route>
                    <Route path="/docs/styling">
                      <Styling />
                    </Route>
                    <Route path="/docs/data-fetching">
                      <DataFetching />
                    </Route>
                    <Route path="/docs/code-splitting">
                      <CodeSplitting />
                    </Route>
                    <Route path="/docs/building-for-deployment">
                      <Building />
                    </Route>
                    {/* Deploy */}
                    <Route path="/docs/deploy">
                      <NotFound />
                    </Route>
                    <Route path="/docs/deploy/deno-deploy">
                      <DenoDeploy />
                    </Route>
                    <Route path="/docs/deploy/fly-docker">
                      <Fly />
                    </Route>
                    <Route path="/docs/deploy/vercel">
                      <NotFound />
                    </Route>
                    <Route path="/docs/deploy/netlify">
                      <NotFound />
                    </Route>
                    <Route path="/docs/deploy/cloudflare">
                      <NotFound />
                    </Route>
                    {/* Hooks */}
                    <Route path="/docs/hooks">
                      <Hooks />
                    </Route>
                    <Route path="/docs/hooks/use-asset">
                      <UseAssetHook />
                    </Route>
                    <Route path="/docs/hooks/use-async">
                      <UseAsyncHook />
                    </Route>
                    <Route path="/docs/hooks/use-env">
                      <UseEnvHook />
                    </Route>
                    <Route path="/docs/hooks/use-island">
                      <UseIslandHook />
                    </Route>
                    <Route path="/docs/hooks/use-preload">
                      <UsePreloadHook />
                    </Route>
                    <Route path="/docs/hooks/use-server-context">
                      <UseServerContextHook />
                    </Route>
                    <Route path="/docs/hooks/use-server-inserted-html">
                      <UseServerInsertedHTMLHook />
                    </Route>
                    <Route>
                      <NotFound />
                    </Route>
                  </Switch>
                </Suspense>
              </DocsLayout>
            </Route>
            <Route>
              404
            </Route>
          </Switch>
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
      <Link href="/" className="logo">
        <Ultra />
        <span>Ultra</span>
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
