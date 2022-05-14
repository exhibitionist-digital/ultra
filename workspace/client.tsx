import { hydrateRoot } from "react-dom/client";
import { UltraClient } from "@ultra/react";
import App from "./src/app.tsx";

function BrowserApp() {
  return (
    <UltraClient>
      <App state={window.__ultra_state} />
    </UltraClient>
  );
}

hydrateRoot(document, <BrowserApp />);
