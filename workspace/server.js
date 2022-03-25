import ultra from "../mod.ts";
import importMap from "./importMap.json" assert { type: "json" };

await ultra({
  importMap,
});
