import { Link } from "wouter";
import { ReactNode } from "react";
import useAsset from "ultra/hooks/use-asset.js";

export function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="docs-layout">
      <link
        rel="stylesheet"
        href={useAsset("/docs.css")}
        //@ts-ignore whatever
        precedence="default"
      />
      <div className="docs-nav">
        <nav>
          <strong>
            <Link href="/docs">Philosophy</Link>
          </strong>
        </nav>
        <nav>
          <strong>Getting Started</strong>
          <Link href="/docs/prerequisites">Prerequisites</Link>
          <Link href="/docs/create-project">Create a Project</Link>
          <Link href="/docs/routing">Routing</Link>
          <Link href="/docs/middleware">Middleware</Link>
          <Link href="/docs/styling">Styling</Link>
          <Link href="/docs/data-fetching">Data Fetching</Link>
        </nav>
        <nav>
          <strong>
            <Link href="/docs/hooks">Hooks</Link>
          </strong>
          <Link href="/docs/use-asset">useAsset</Link>
          <Link href="/docs/use-async">useAsync</Link>
          <Link href="/docs/use-env">useEnv</Link>
          <Link href="/docs/use-island">useIsland</Link>
          <Link href="/docs/use-preload">usePreload</Link>
          <Link href="/docs/use-server-context">useServerContext</Link>
          <Link href="/docs/use-server-inserted-html">
            useServerInsertedHTML
          </Link>
        </nav>
        <nav>
          <strong>Deployment</strong>
          <Link href="/docs/deno-deploy">Deno Deploy</Link>
          <Link href="/docs/fly-docker">fly.io / Docker</Link>
          <Link href="/docs/vercel">Vercel</Link>
          <Link href="/docs/netlify">Netlify</Link>
          <Link href="/docs/cloudflare">Cloudflare</Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
