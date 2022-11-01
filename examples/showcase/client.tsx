import { cssomSheet } from "twind";
import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import { TWProvider } from "./src/context/twind.tsx";

hydrate(
  document,
  <TWProvider sheet={cssomSheet()}>
    <App pathname={location.pathname} />
  </TWProvider>,
);
