import { Helmet, HelmetProvider } from "react-helmet";
import React, { lazy, useEffect, useState } from "react";
import Ticker from "./components/Ticker.tsx";
import Component from "./component.jsx";
import type { State } from "../../server.ts";

const BigLazyComponent = lazy(() => import("./components/BigComponent.tsx"));

export const CTX = React.createContext(`un-bundle the web`);

export default function App({ state }: State) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <HelmetProvider context={state}>
      <html lang="en">
        <head>
          <Helmet>
            <title>Ultra</title>
            <link rel="stylesheet" href="/public/style.css" />
          </Helmet>
        </head>
        <body>
          <img src="/public/ultra.svg" />
          <Component />
          <Ticker label="Hydrated" ticked={mounted} />
          <BigLazyComponent />
        </body>
      </html>
    </HelmetProvider>
  );
}
