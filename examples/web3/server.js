// import ultra from "https://deno.land/x/ultra@v0.6/mod.ts";
import ultra from "../../mod.ts";

ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});
