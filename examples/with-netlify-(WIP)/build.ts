import { createBuilder } from "ultra/build.ts";
import { netlify } from "ultra/lib/build/plugins/netlify.ts";

const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
  plugin: netlify,
});

builder.ignore([
  "./README.md",
  "./importMap.json",
  "./*.dev.json",
  "./*.test.ts",
]);

// deno-lint-ignore no-unused-vars
const result = await builder.build();
