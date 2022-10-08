import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { createBuilder } from "../../build.ts";

const TEST_FIXTURES = !Deno.env.get("TEST_FIXTURE");

Deno.test(
  "it works with a browser entrypoint",
  { ignore: TEST_FIXTURES },
  async () => {
    const builder = createBuilder({
      browserEntrypoint: import.meta.resolve("./client.tsx"),
      serverEntrypoint: import.meta.resolve("./server.tsx"),
    });

    builder.ignore([
      "./README.md",
      "./importMap.json",
      "./*.test.*",
    ]);

    const result = await builder.build();

    assertEquals(result.outputSources.size > 0, true);
  },
);

Deno.test(
  "it works without a browser entrypoint",
  { ignore: TEST_FIXTURES },
  async () => {
    const builder = createBuilder({
      serverEntrypoint: import.meta.resolve("./server.tsx"),
    });

    builder.ignore([
      "./README.md",
      "./importMap.json",
      "./*.test.*",
    ]);

    const result = await builder.build();

    assertEquals(result.outputSources.size > 0, true);
  },
);
