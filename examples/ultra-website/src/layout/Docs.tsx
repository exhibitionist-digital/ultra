import { Link } from "wouter";
import { MDXProvider } from "@mdx-js/react";
import { ReactNode } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import { ModuleSource } from "../components/ModuleSource.tsx";
import { HotTip } from "../components/HotTip.tsx";

const Blank = ({ href, children }) => {
  return (
    <a href={href} target={href.indexOf("#") == 0 ? "_self" : "_blank"}>
      {children}
    </a>
  );
};

export function DocsLayout({ children }: { children: ReactNode }) {
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
        <div className="docs-nav">
          <nav>
            <strong>
              <Link href="/docs">📖 Philosophy</Link>
            </strong>
            <strong>
              <Link href="/docs/knowledge-base">🧠 Knowledge Base</Link>
            </strong>
          </nav>
          <nav>
            <em>Getting Started</em>
            <Link href="/docs/prerequisites">Prerequisites</Link>
            <Link href="/docs/create-project">Create a Project</Link>
            <Link href="/docs/routing">Routing</Link>
            <Link href="/docs/middleware">Middleware</Link>
            <Link href="/docs/styling">Styling</Link>
            <Link href="/docs/data-fetching">Data Fetching</Link>
            <Link href="/docs/code-splitting">Code Splitting</Link>
            <Link href="/docs/building-for-deployment">
              Building for Deployment
            </Link>
          </nav>
          <nav>
            <em>Deployment</em>
            <Link href="/docs/deploy/deno-deploy">🦕 Deno Deploy</Link>
            <Link href="/docs/deploy/fly-docker">🪰 fly.io / Docker</Link>
            <Link href="/docs/deploy/vercel" disabled>Vercel</Link>
            <Link href="/docs/deploy/netlify" disabled>Netlify</Link>
            <Link href="/docs/deploy/cloudflare" disabled>Cloudflare</Link>
          </nav>
          <nav>
            <strong>
              <Link href="/docs/hooks">🪝 Hooks</Link>
            </strong>
            <Link href="/docs/hooks/use-asset">useAsset</Link>
            {/* <Link href="/docs/hooks/use-async" disabled>useAsync</Link> */}
            <Link href="/docs/hooks/use-env" disabled>useEnv</Link>
            {/* <Link href="/docs/hooks/use-island" disabled>useIsland</Link> */}
            <Link href="/docs/hooks/use-preload">usePreload</Link>
            <Link href="/docs/hooks/use-server-context" disabled>
              useServerContext
            </Link>
            <Link href="/docs/hooks/use-server-inserted-html" disabled>
              useServerInsertedHTML
            </Link>
          </nav>
        </div>
        <div className="page docs">
          {children}
        </div>
      </div>
    </MDXProvider>
  );
}
