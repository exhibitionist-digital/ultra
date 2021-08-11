import ultra from "https://deno.land/x/ultra/mod.js";

await ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});
