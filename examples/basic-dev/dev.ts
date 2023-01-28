import { fromFileUrl } from "https://deno.land/std@0.167.0/path/mod.ts";
import { createDev } from "../../dev.ts";

const dev = createDev({
  output: fromFileUrl(import.meta.resolve("../.dev")),
});

await dev(import.meta.resolve("./server.tsx"));
