import vendor from "./vendor.ts";
import { emptyDir } from "./deps.ts";
import { assert } from "./deps.dev.ts";

import {
  afterEach,
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@0.137.0/testing/bdd.ts";

const ENV_VAR = {
  name: "importMap",
  value: "./workspace/importMap.json",
};

describe("vendor mapping", () => {
  beforeEach(() => {
    Deno.env.set(ENV_VAR.name, ENV_VAR.value);
  });
  afterEach(async () => {
    await emptyDir("./.ultra");
    Deno.env.delete(ENV_VAR.name);
  });

  it("should create vendor map with imports prop", async () => {
    const vendorMap = await vendor({ dir: ".ultra" });
    // console.error("vendor map json", vendorMap);
    assert(vendorMap.imports.react);
    assert(!vendorMap.imports.adfadf);
  });
});
