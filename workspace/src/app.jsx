import React, { lazy, useEffect } from "react";
import { SWRConfig } from "swr";
import { Helmet } from "react-helmet";
import ultraCache from "ultra/cache";

import Component from "./component.jsx";

const BigLazyComponent = lazy(() => import("./components/BigComponent.tsx"));

export const CTX = React.createContext(`default value`);

const options = (cache) => ({
  provider: () => ultraCache(cache),
  suspense: true,
});

const Ultra = ({ cache }) => {
  useEffect(() => {
    console.log("mount");
  }, []);
  return (
    <SWRConfig value={options(cache)}>
      <Helmet>
        <link rel="stylesheet" href="/style.css" />
      </Helmet>

      <img src="/ultra.svg" />
      <h1>ULTRA</h1>

      <Component />
      <BigLazyComponent />
    </SWRConfig>
  );
};

export default Ultra;
