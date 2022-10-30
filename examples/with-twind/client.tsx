import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import { TWProvider } from "./src/context/twind.tsx";
import { cssomSheet } from "twind";

hydrate(
  document,
  <TWProvider sheet={cssomSheet()}>
    <App />
  </TWProvider>,
);
