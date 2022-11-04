import { createBuilder } from "ultra/build.ts";

const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.ignore([
  "./README.md",
  "./fly.toml",
  "./Dockerfile",
  "./importMap.json",
  "./*.dev.json",
]);

// deno-lint-ignore no-unused-vars
const result = await builder.build();
