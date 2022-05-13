import React, { lazy, useEffect, useState } from "react";
import Ticker from "./components/Ticker.tsx";

import Component from "./component.jsx";

const BigLazyComponent = lazy(() => import("./components/BigComponent.tsx"));

export const CTX = React.createContext(`un-bundle the web`);

const Ultra = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      <link rel="stylesheet" href="/public/style.css" />
      <img src="/public/ultra.svg" />
      <Component />
      <Ticker label="Hydrated" ticked={mounted} />
      <BigLazyComponent />
    </>
  );
};

export default Ultra;
