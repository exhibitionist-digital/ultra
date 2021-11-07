import React, { lazy, Suspense } from "https://esm.sh/react@18.0.0-alpha-67f38366a-20210830";
import { Helmet } from "https://esm.sh/react-helmet-async?deps=react@18.0.0-alpha-67f38366a-20210830&bundle";
import { Route } from "https://esm.sh/wouter?deps=react@18.0.0-alpha-67f38366a-20210830&bundle";
import { SWRConfig } from "https://esm.sh/swr@1.0.0?deps=react@18.0.0-alpha-67f38366a-20210830&bundle";
import ultraCache from "ultra/cache";

const Index = lazy(() => import("./index.jsx"));

const Ultra = ({ cache }) => {
  return (
    <SWRConfig value={{ provider: () => ultraCache(cache) }}>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="/style.css?react18" />
        <title>Ultra: React 18 Streaming SSR</title>
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://ultrajs.dev/logo.svg"
        />
      </Helmet>
      <Suspense fallback={null}>
        <Route path="/">
          <Index />
        </Route>
      </Suspense>
    </SWRConfig>
  );
};

export default Ultra;
