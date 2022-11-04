import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";

hydrate(document, <App />);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}
