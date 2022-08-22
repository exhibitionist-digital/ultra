import { Route, Routes } from "react-router-dom";
import { DefaultLayout } from "./layouts/DefaultLayout.tsx";
import HomePage from "./pages/Home.tsx";
import AboutPage from "./pages/About.tsx";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-react-router</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/public/favicon.ico" />
      </head>
      <body>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="about"
              element={<AboutPage />}
            />
          </Route>
        </Routes>
      </body>
    </html>
  );
}
