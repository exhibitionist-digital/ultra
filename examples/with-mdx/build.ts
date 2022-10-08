import { createBuilder } from "ultra/build.ts";
import { compile } from "./mdx.ts";

const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.ignore([
  "./content/**/*",
  "./README.md",
  "./importMap.json",
  "./*.dev.json",
  "./*.test.ts",
]);

/**
 * Compile our mdx
 */
await compile("./content");
builder.log.success("Compiled MDX");

// deno-lint-ignore no-unused-vars
const result = await builder.build();
