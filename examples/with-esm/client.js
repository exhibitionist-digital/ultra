import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./src/app.js";

hydrateRoot(document, React.createElement(App));
