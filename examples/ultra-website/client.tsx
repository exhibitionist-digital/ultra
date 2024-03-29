import hydrate from "ultra/hydrate.js";
import { Router } from "wouter";
import App from "./src/app.tsx";

hydrate(
  document,
  <Router>
    <App />
  </Router>,
);
