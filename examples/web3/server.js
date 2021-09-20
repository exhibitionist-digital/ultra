import ultra from "https://deno.land/x/ultra@v0.5/mod.ts";

ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});
