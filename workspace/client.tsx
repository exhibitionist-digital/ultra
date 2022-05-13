import { hydrateRoot } from "react-dom/client";
import App from "./src/app.tsx";

function BrowserApp() {
  return <App state={window.__ultra_state} />;
}

hydrateRoot(document, <BrowserApp />);
