import React, { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { Route } from "wouter";
import { SWRConfig } from "swr";
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
