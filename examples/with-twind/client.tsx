import { hydrateRoot } from "react-dom/client";
import "./twind.ts";
import App from "./src/app.tsx";

hydrateRoot(document, <App />);
