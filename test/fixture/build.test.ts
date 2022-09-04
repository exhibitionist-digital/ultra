import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import builder from "./build.ts";

Deno.test("it works", async (t) => {
  const result = await builder.build();
  console.log(result);
});
