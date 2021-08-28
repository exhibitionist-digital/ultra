import ultra from "https://deno.land/x/ultra@v0.2/mod.js";

await ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});
