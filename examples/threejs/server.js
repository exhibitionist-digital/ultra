import ultra from "https://deno.land/x/ultra@v0.6/mod.ts";

await ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});
