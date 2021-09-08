import ultra from "https://deno.land/x/ultra@v0.5/mod.ts";

await ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});
