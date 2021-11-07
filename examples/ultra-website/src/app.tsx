import React, { lazy, Suspense } from "https://esm.sh/react@18.0.0-alpha-67f38366a-20210830";
import { Helmet } from "https://esm.sh/react-helmet-async?deps=react@18.0.0-alpha-67f38366a-20210830&bundle";
import { Route } from "https://esm.sh/wouter?deps=react@18.0.0-alpha-67f38366a-20210830&bundle";
import { SWRConfig } from "https://esm.sh/swr@1.0.0?deps=react@18.0.0-alpha-67f38366a-20210830&bundle";
import ultraCache from "ultra/cache";
import { Cache } from "https://deno.land/x/ultra/src/types.ts";

const Index = lazy(() => import("./index.jsx"));

const options = (cache) => ({
  provider: () => ultraCache(cache),
  revalidateIfStale: false,
  revalidateOnMount: false,
  suspense: true,
});

const Ultra = ({ cache }: { cache: Cache }) => {
  return (
    <SWRConfig value={options(cache)}>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="/style.css?ultra" />
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
        <meta property="og:image" content="https://ultrajs.dev/screen.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
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
