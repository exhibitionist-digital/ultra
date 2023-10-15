import { lazy, Suspense, useState } from "react";
import { ErrorBoundary } from "https://esm.sh/*react-error-boundary@4.0.11";
import { ImportMapScript } from "ultra/lib/react/client.js";

const LazyComponent = lazy(() => import("./components/Test.tsx"));

const logError = (error: Error, info: { componentStack: string }) => {
  console.log(error, info);
};

export default function App() {
  const [state, setState] = useState(0);
  return (
    <html>
      <head>
        <title>Testing</title>
        <link rel="stylesheet" href="/style.css" />
        <ImportMapScript />
      </head>
      <body>
        <main>Hello World {state}</main>
        <ErrorBoundary
          fallback={<div>Something went wrong</div>}
          onError={logError}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent />
          </Suspense>
        </ErrorBoundary>
        <button onClick={() => setState(state + 1)}>Click Me</button>
      </body>
    </html>
  );
}
