import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./src/app.tsx";

hydrateRoot(
  document,
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
