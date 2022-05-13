import { hydrateRoot } from "react-dom/client";
import App from "./src/app.tsx";

function BrowserApp() {
  return <App />;
}

hydrateRoot(document, <BrowserApp />);
