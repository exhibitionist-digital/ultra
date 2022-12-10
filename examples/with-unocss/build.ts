import { createBuilder } from "ultra/build.ts";
import { build } from "unocss/cli";

const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.ignore([
  "./README.md",
  "./importMap.json",
  "./*.dev.json",
  "./*.test.ts",
]);

await build({
  patterns: ["src/**/*"],
  outFile: "public/uno.css",
});

// deno-lint-ignore no-unused-vars
const result = await builder.build();
