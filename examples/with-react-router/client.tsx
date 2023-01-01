import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./src/routes.tsx";

const router = createBrowserRouter(routes);

hydrate(
  document,
  <App>
    <RouterProvider router={router} />
  </App>,
);
