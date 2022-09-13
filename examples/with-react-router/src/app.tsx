import { Route, Routes } from "react-router-dom";
import useServerContext from "ultra/hooks/use-server-context.js";
import { DefaultLayout } from "./layouts/DefaultLayout.tsx";
import AboutPage from "./pages/About.tsx";
import HomePage from "./pages/Home.tsx";

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
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="about"
              element={<AboutPage />}
            />
            <Route path="*" element={<RouteNotFound />} />
          </Route>
        </Routes>
      </body>
    </html>
  );
}
