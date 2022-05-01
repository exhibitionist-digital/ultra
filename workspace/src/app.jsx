import React, { lazy, useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { Helmet } from "react-helmet";
import ultraCache from "ultra/cache";
import Ticker from "./components/Ticker.tsx";
import message from "./lib/a.js";

import Component from "./component.jsx";

const BigLazyComponent = lazy(() => import("./components/BigComponent.tsx"));

export const CTX = React.createContext(`un-bundle the web`);

const options = (cache) => ({
  provider: () => ultraCache(cache),
  suspense: true,
});

const Ultra = ({ cache }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <SWRConfig value={options(cache)}>
      <Helmet>
        <title>Ultra</title>
        <link rel="stylesheet" href="/style.css" />
      </Helmet>

      <img src="/ultra.svg" />
      <Component />
      <Ticker label="Hydrated" ticked={mounted} />
      <BigLazyComponent />
      {message}
    </SWRConfig>
  );
};

export default Ultra;
