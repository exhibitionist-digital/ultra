import { setup } from "@twind/core";
import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import { sheet } from "./src/twind.ts";
import config from "./src/twind.config.js";

//@ts-ignore twind types issue
setup(config, sheet);

hydrate(document, <App />);
