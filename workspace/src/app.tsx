import { Helmet, HelmetProvider } from "react-helmet";
import { createContext, lazy, useEffect, useState } from "react";
import Ticker from "./components/Ticker.tsx";
import Component from "./component.jsx";
import type { State } from "../../server.ts";
import useSWR from "swr";

const BigLazyComponent = lazy(() => import("./components/BigComponent.tsx"));

export const CTX = createContext(`un-bundle the web`);

type AppProps = {
  state: State;
};

export default function App({ state }: AppProps) {
  const [mounted, setMounted] = useState(false);
  const { data } = useSWR("https://jsonplaceholder.typicode.com/posts/1");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <HelmetProvider context={state}>
      <html lang="en">
        <head>
          <Helmet>
            <title>Ultra</title>
            <link rel="icon" type="image/x-icon" href="/public/favicon.ico" />
            <link rel="stylesheet" href="/public/style.css" />
          </Helmet>
        </head>
        <body>
          <img src="/public/ultra.svg" />
          <Component />
          <Ticker label="Hydrated" ticked={mounted} />
          <BigLazyComponent />
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </body>
      </html>
    </HelmetProvider>
  );
}
