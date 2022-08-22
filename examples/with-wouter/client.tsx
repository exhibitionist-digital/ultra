import { hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./src/app.tsx";

hydrateRoot(
  document,
  <Router>
    <App />
  </Router>,
);
