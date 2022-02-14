import ultra from "../mod.ts";
import importmap from "./importmap.json" assert { type: "json" };

await ultra({
  importmap,
});
