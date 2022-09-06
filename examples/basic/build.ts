import { createBuilder } from "ultra/build.ts";

const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.ignore("./README.md");
builder.ignore("./*.test.ts");

// deno-lint-ignore no-unused-vars
const result = await builder.build();
