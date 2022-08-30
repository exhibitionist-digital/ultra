import { createBuilder } from "ultra/build.ts";

const builder = createBuilder({
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.setExcluded([
  "./README.md",
]);

// deno-lint-ignore no-unused-vars
const result = await builder.build();
