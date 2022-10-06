import hydrate from "ultra/hydrate.js";
import { Router } from "wouter";
import App from "./src/app.tsx";
import { SearchParamsProvider } from "./src/context/SearchParams.tsx";

hydrate(
  document,
  <Router>
    <SearchParamsProvider value={new URLSearchParams(window.location.search)}>
      <App />
    </SearchParamsProvider>
  </Router>,
);
