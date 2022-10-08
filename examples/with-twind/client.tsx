import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import "./twind.ts";

hydrate(document, <App />);
