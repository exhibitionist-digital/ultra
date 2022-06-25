import { Helmet, HelmetProvider } from "react-helmet";
import { Link, Route, Switch } from "wouter";
import React, { createContext, lazy, Suspense } from "react";
import Component from "./component.jsx";
import type { RenderState } from "../../server.ts";

const BigLazyComponent = lazy(() => import("./components/BigComponent.tsx"));

export const CTX = createContext(`un-bundle the web`);

type AppProps = {
  state: RenderState;
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
          <Suspense fallback={<h1>top</h1>}>
            <Link href="/">home</Link>
            <Link href="/test">test</Link>
            <Switch>
              <Route path="/">
                <Suspense fallback={<h2>comp</h2>}>
                  <Component />
                </Suspense>
              </Route>
              <Route path="/test">
                <Suspense fallback={<h2>bottom</h2>}>
                  <BigLazyComponent />
                </Suspense>
              </Route>
              <Route>
                <strong>404</strong>
              </Route>
            </Switch>
          </Suspense>
        </body>
      </html>
    </HelmetProvider>
  );
}
