import { createBuilder } from "ultra/build.ts";

const builder = createBuilder({
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.ignore("./README.md");

// deno-lint-ignore no-unused-vars
const result = await builder.build();
