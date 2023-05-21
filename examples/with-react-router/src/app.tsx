import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import useServerContext from "ultra/hooks/use-server-context.js";
import { DefaultLayout } from "@/layouts/DefaultLayout.tsx";

const HomePage = lazy(() => import("@/pages/Home.tsx"));
const AboutPage = lazy(() => import("@/pages/About.tsx"));

function RouteNotFound() {
  useServerContext((context) => {
    context.status(404);
  });
  return <div>Not found</div>;
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-react-router</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <Suspense fallback={<div>Page is Loading...</div>}>
          <Routes>
            <Route path="/" element={<DefaultLayout />}>
              {/** @ts-ignore  TS2590 [ERROR]: Expression produces a union type that is too complex to represent: https://github.com/microsoft/TypeScript/issues/42790 */}
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<RouteNotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </body>
    </html>
  );
}
