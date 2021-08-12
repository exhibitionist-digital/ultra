import ultra from "https://deno.land/x/ultra@v0.1/mod.js";

await ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});
