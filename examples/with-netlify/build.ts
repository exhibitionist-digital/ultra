import build from "ultra/build.ts";
import { netlify } from "../../lib/build/plugins/netlify.ts";

await build({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
  plugin: netlify,
});
