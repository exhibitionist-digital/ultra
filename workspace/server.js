import ultra from "../mod.ts";
import importMap from "./importmap.json" assert { type: "json" };

await ultra({
  importMap,
  base: "http://localhost:8000",
  root: "src",
  lang: "en",
});