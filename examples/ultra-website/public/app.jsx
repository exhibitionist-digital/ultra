import React, { lazy, Suspense } from "react";
import { Helmet } from "helmet";
import { Route } from "wouter";
import { SWRConfig } from "swr";
import ultraCache from "ultra-cache";

const Index = lazy(() => import("./index.jsx"));

const options = (cache) => ({
  provider: () => ultraCache(cache),
  revalidateIfStale: false,
  revalidateOnMount: false,
});

const Ultra = ({ cache }) => {
  return (
    <SWRConfig value={options(cache)}>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="/style.css" />
        <title>Ultra</title>
        <meta
          name="description"
          content="Deno + React: No build, No bundle, All streaming"
        />
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
