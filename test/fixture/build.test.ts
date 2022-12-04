import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.164.0/testing/asserts.ts";
import { createBuilder } from "../../build.ts";

Deno.test(
  "it works with a browser entrypoint",
  async () => {
    const builder = createBuilder({
      browserEntrypoint: import.meta.resolve("./client.tsx"),
      serverEntrypoint: import.meta.resolve("./server.tsx"),
      output: "./output/browser-entrypoint",
    });

    builder.ignore([
      "./output/",
      "./README.md",
      "./importMap.json",
      "./*.test.*",
    ]);

    const result = await builder.build();
    const ignoredOutput = result.outputSources.filter((source) =>
      source.relativePath().startsWith("./output/")
    );

    assertEquals(ignoredOutput.size, 0);
    assertEquals(result.outputSources.size > 0, true);
    assertEquals(result.dynamicImports.size, 2);

    // Test that the built output starts correctly
    const process = await Deno.run({
      cwd: "./output/browser-entrypoint",
      cmd: [Deno.execPath(), "task", "start"],
    });

    const status = await process.status();
    assert(status.success);
    await process.close();
  },
);

Deno.test(
  "it works without a browser entrypoint",
  async () => {
    const builder = createBuilder({
      serverEntrypoint: import.meta.resolve("./server.no-browser.tsx"),
      output: "./output/no-browser-entrypoint",
    });

    builder.ignore([
      "./output/",
      "./README.md",
      "./importMap.json",
      "./*.test.*",
    ]);

    const result = await builder.build();

    assertEquals(result.outputSources.size > 0, true);
    assertEquals(result.dynamicImports.size, 2);

    // Test that the built output starts correctly
    const process = await Deno.run({
      cwd: "./output/no-browser-entrypoint",
      cmd: [Deno.execPath(), "task", "start:no-browser"],
    });

    const status = await process.status();
    assert(status.success);
    await process.close();
  },
);

Deno.test(
  "it works with vendorDependencies false",
  async () => {
    const builder = createBuilder({
      browserEntrypoint: import.meta.resolve("./client.tsx"),
      serverEntrypoint: import.meta.resolve("./server.tsx"),
      vendorDependencies: false,
      output: "./output/no-vendor-deps",
    });

    builder.ignore([
      "./output/",
      "./README.md",
      "./importMap.json",
      "./*.test.*",
    ]);

    const result = await builder.build();

    assertEquals(result.outputSources.size > 0, true);
    assertEquals(result.dynamicImports.size, 2);

    // Test that the built output starts correctly
    const process = await Deno.run({
      cwd: "./output/no-vendor-deps",
      cmd: [Deno.execPath(), "task", "start"],
    });

    const status = await process.status();
    assert(status.success);
    await process.close();
  },
);

Deno.test(
  "it works with inlineServerDynamicImports true",
  async () => {
    const builder = createBuilder({
      browserEntrypoint: import.meta.resolve("./client.tsx"),
      serverEntrypoint: import.meta.resolve("./server.tsx"),
      inlineServerDynamicImports: true,
      output: "./output/inline-dynamic-imports",
    });

    builder.ignore([
      "./output/",
      "./README.md",
      "./importMap.json",
      "./*.test.*",
    ]);

    const result = await builder.build();

    assertEquals(result.outputSources.size > 0, true);
    assertEquals(result.dynamicImports.size, 2);

    // Test that the built output starts correctly
    const process = await Deno.run({
      cwd: "./output/inline-dynamic-imports",
      cmd: [Deno.execPath(), "task", "start"],
    });

    const status = await process.status();
    assert(status.success);
    await process.close();
  },
);
