import { Link } from "wouter";
import { MDXProvider } from "@mdx-js/react";
import { ReactNode } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import { ModuleSource } from "../components/ModuleSource.tsx";

export function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <MDXProvider
      components={{
        ModuleSource: ModuleSource,
      }}
    >
      <div className="docs-layout">
        <link
          rel="stylesheet"
          href={useAsset("/styles/docs.css")}
          //@ts-ignore whatever
          precedence="default"
        />
        <div className="docs-nav">
          <nav>
            <strong>
              <Link href="/docs">Philosophy</Link>
            </strong>
            <strong>
              <Link href="/docs/knowledge-base">Knowledge Base</Link>
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
            <strong>Production Build</strong>
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
        <div className="page docs">
          {children}
        </div>
      </div>
    </MDXProvider>
  );
}
