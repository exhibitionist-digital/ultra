import { fileExtension } from "../io.ts";
import { Config } from "../config.ts";

export function buildContent(config: Config) {
  const ext = fileExtension(config);
  return `
  import { createBuilder } from "ultra/build.ts";

const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("${ext("./client", true)}"),
  serverEntrypoint: import.meta.resolve("${ext("./server", true)}"),
});

builder.ignore([
  "./README.md",
  "./importMap.json",
  "./.git/**",
  "./.vscode/**",
  "./.github/**",
  "./.gitignore"
]);

// deno-lint-ignore no-unused-vars
const result = await builder.build();
  `;
}
