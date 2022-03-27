import vendor from "./src/vendor.ts";

await Deno.writeTextFile(
  `vendorMap.json`,
  JSON.stringify(await vendor()),
);
