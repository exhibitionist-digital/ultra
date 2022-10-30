import { cssomSheet } from "twind";
import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import { TWProvider } from "./src/context/twind.tsx";
import { theme } from "./theme.ts";

hydrate(
  document,
  <TWProvider sheet={cssomSheet()} theme={theme}>
    <App />
  </TWProvider>,
);
