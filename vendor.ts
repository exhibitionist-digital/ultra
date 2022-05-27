import vendor from "./src/vendor.ts";

await Deno.writeTextFile(
  `vendorMap.json`,
  JSON.stringify(await vendor({ dir: ".ultra" }), null, 2),
);

console.log("Vendor complete");
