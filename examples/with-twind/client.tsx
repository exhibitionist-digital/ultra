import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";

// Twind
import "./src/twind/twind.ts";

hydrate(document, <App />);
