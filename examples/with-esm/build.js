import { createBuilder } from "ultra/build.ts";

const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("./client.js"),
  serverEntrypoint: import.meta.resolve("./server.js"),
});

builder
  .ignore("./README.md")
  .ignore("./fly.toml")
  .ignore("./DockerFile");

// deno-lint-ignore no-unused-vars
const result = await builder.build();
