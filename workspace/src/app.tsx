import { Helmet, HelmetProvider } from "react-helmet";
import { createContext, lazy, Suspense } from "react";
import Component from "./component.jsx";
import type { State } from "../../server.ts";

const BigLazyComponent = lazy(() => import("./components/BigComponent.tsx"));

export const CTX = createContext(`un-bundle the web`);

type AppProps = {
  state: State;
};

export default function App({ state }: AppProps) {
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
          <Suspense>
            <img src="/public/ultra.svg" />
            <Component />
            <BigLazyComponent />
          </Suspense>
        </body>
      </html>
    </HelmetProvider>
  );
}
