import { Link, useLocation } from "wouter";
import { MDXProvider } from "@mdx-js/react";
import { ReactNode, useEffect, useState } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import { ModuleSource } from "../components/ModuleSource.tsx";
import { HotTip } from "../components/HotTip.tsx";
import { Ultra } from "../app.tsx";

const Blank = ({ href, children }) => {
  return (
    <a href={href} target={href.indexOf("#") == 0 ? "_self" : "_blank"}>
      {children}
    </a>
  );
};

export function DocsLayout(
  { children }: { children: ReactNode },
) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location]);
  return (
    <MDXProvider
      components={{
        ModuleSource,
        HotTip,
        a: Blank,
      }}
    >
      <div className="docs-layout">
        <link
          rel="stylesheet"
          href={useAsset("/styles/docs.css")}
          //@ts-ignore whatever
          precedence="default"
        />

        <div className={`docs-nav ${open ? "open" : ""}`}>
          <nav>
            <Link href="/">
              <a>
                <Ultra />
              </a>
            </Link>

            <button onClick={() => setOpen(!open)}>Close Menu</button>

            <strong>
              <Link href="/philosophy">📖 Philosophy</Link>
            </strong>
            <strong>
              <Link href="/knowledge-base">🧠 Knowledge Base</Link>
            </strong>
          </nav>
          <nav>
            <em>Getting Started</em>
            <Link href="/prerequisites">Prerequisites</Link>
            <Link href="/create-project">Create a Project</Link>
            <Link href="/routing">Routing</Link>
            <Link href="/middleware">Middleware</Link>
            <Link href="/styling">Styling</Link>
            <Link href="/data-fetching">Data Fetching</Link>
            <Link href="/code-splitting">Code Splitting</Link>
            <Link href="/building-for-deployment">
              Building for Deployment
            </Link>
          </nav>
          <nav>
            <em>Deployment</em>
            <Link href="/deno-deploy">🦕 Deno Deploy</Link>
            <Link href="/fly-docker">🪰 fly.io / Docker</Link>
          </nav>
          <nav>
            <em>Hooks</em>
            <Link href="/use-asset">useAsset</Link>
            {/* <Link href="/hooks/use-async" disabled>useAsync</Link> */}
            <Link href="/use-env" disabled>useEnv</Link>
            {/* <Link href="/hooks/use-island" disabled>useIsland</Link> */}
            <Link href="/use-preload">usePreload</Link>
            <Link href="/use-server-context" disabled>
              useServerContext
            </Link>
            <Link href="/use-server-inserted-html" disabled>
              useServerInsertedHTML
            </Link>
          </nav>
        </div>
        <div className="page docs">
          <strong>
            <button onClick={() => setOpen(!open)}>Open Menu</button>
          </strong>
          {children}
        </div>
      </div>
    </MDXProvider>
  );
}
