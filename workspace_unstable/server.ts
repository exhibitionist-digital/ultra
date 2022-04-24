import { unstable_ultra } from "../unstable.ts";
import App, { createRequestContext } from "./src/app.tsx";

await unstable_ultra(App, { createRequestContext });
