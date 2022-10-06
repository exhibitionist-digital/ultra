import { BrowserRouter } from "react-router-dom";
import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";

hydrate(
  document,
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
