import { hydrateRoot } from "react-dom/client";
import { Ultra } from "@ultra/react";
import App from "./src/app.tsx";

function BrowserApp() {
  return (
    <Ultra>
      <App state={window.__ultra_renderState} />
    </Ultra>
  );
}

hydrateRoot(document, <BrowserApp />);
