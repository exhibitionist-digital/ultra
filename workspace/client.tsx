import { hydrateRoot } from "react-dom/client";
import App from "./src/app.jsx";

function BrowserApp() {
  return <App />;
}

hydrateRoot(document, <BrowserApp />);
