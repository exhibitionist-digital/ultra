import build from "ultra/build.ts";

await build({
  browserEntrypoint: import.meta.resolve("./client.js"),
  serverEntrypoint: import.meta.resolve("./server.js"),
});
