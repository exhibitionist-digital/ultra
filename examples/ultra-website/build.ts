import { createBuilder } from "ultra/build.ts";

const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.setExcluded([
  "./README.md",
  "./fly.toml",
  "./Dockerfile",
]);

builder.setHashed([
  "./src/**/*.+(ts|tsx|js|jsx|css)",
  "./public/**/*.+(css)",
  "./client.tsx",
]);

// deno-lint-ignore no-unused-vars
const result = await builder.build();
