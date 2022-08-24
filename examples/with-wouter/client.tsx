import { hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./src/app.tsx";
import { SearchParamsProvider } from "./src/context/SearchParams.tsx";

hydrateRoot(
  document,
  <Router>
    <SearchParamsProvider value={new URLSearchParams(window.location.search)}>
      <App />
    </SearchParamsProvider>
  </Router>,
);
