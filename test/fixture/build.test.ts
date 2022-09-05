import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { createBuilder } from "ultra/build.ts";

Deno.test("it works with a browser entrypoint", async () => {
  const builder = createBuilder({
    browserEntrypoint: import.meta.resolve("./client.tsx"),
    serverEntrypoint: import.meta.resolve("./server.tsx"),
  });

  builder.ignore("./README.md");
  builder.ignore("./*.test.*");

  const result = await builder.build();

  assertEquals(result.sources.size, 9);
});

Deno.test("it works without a browser entrypoint", async () => {
  const builder = createBuilder({
    serverEntrypoint: import.meta.resolve("./server.tsx"),
  });

  builder.ignore("./README.md");
  builder.ignore("./*.test.*");

  const result = await builder.build();

  assertEquals(result.sources.size, 9);
});
