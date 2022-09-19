import { hydrateRoot } from "react-dom/client";
import App from "./src/app.jsx";

// Wouter
import { Router } from "wouter";
import { SearchParamsProvider } from "./src/wouter/index.jsx";

function ClientApp() {
  return (
    <Router>
      <SearchParamsProvider value={new URLSearchParams(window.location.search)}>
        <App />
      </SearchParamsProvider>
    </Router>
  );
}

hydrateRoot(document, <ClientApp />);
