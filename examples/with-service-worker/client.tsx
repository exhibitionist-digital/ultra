import { hydrateRoot } from "react-dom/client";
import App from "./src/app.tsx";

hydrateRoot(document, <App />);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}
