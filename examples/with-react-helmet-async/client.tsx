import { HelmetProvider } from "react-helmet-async";
import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";

hydrate(
  document,
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
