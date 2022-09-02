import { createBuilder } from "ultra/build.ts";

const builder = createBuilder({
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.ignore("./README.md");

/**
 * Add our own browser entrypoint, since we
 * aren't using the default
 */
builder.entrypoint("./src/app.tsx", {
  vendorOutputDir: "browser",
  target: "browser",
});

// deno-lint-ignore no-unused-vars
const result = await builder.build();
