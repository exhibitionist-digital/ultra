import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./src/app.tsx";

hydrateRoot(
  document,
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
