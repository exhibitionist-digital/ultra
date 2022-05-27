import vendor from "./vendor.ts";
import { emptyDir } from "./deps.ts";
import { assert } from "./deps.dev.ts";

import {
  afterEach,
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";

const ENV_VAR = {
  name: "importMap",
  value: "./importMap.test.json",
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
    assert(vendorMap.imports.react);
    assert(!vendorMap.imports.adfadf);
  });
});
