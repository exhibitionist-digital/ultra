import React from "react";
import hydrate from "ultra/hydrate.js";
import App from "./src/app.js";

hydrate(document, React.createElement(App));
