import build from "ultra/build.ts";

await build({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
  exclude: ["./README.md", "./build.ts"],
});
