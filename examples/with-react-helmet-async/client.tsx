import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./src/app.tsx";

hydrateRoot(
  document,
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
