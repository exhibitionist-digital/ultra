export function buildContent() {
  return `
    import { createBuilder } from "ultra/build.ts";
    
    const builder = createBuilder({
      browserEntrypoint: import.meta.resolve("./client.tsx"),
      serverEntrypoint: import.meta.resolve("./server.tsx"),
    });

    builder.setExcluded([
      "./README.md",
      ]);

    // deno-lint-ignore no-unused-vars
    const result = await builder.build();
  `;
}
