import { resolveConfig, resolveImportMap } from "./config.ts";
import { afterEach, assert, beforeEach, describe, it } from "./deps.dev.ts";

describe("config.ts tests", () => {
  const cwd = Deno.cwd();
  describe("resolveConfig", () => {
    beforeEach(() => {
      Deno.env.set("config", "./workspace/deno.json");
    });

    afterEach(() => {
      Deno.env.delete("config");
    });
    it("should retrieve the deno config file", async () => {
      const config = await resolveConfig(cwd);
      assert(config);
    });
  });

  describe("resolveImportMap", () => {
    beforeEach(() => {
      Deno.env.set("importMap", "./importMap.test.json");
    });
    afterEach(() => {
      Deno.env.delete("importMap");
    });
    it("should resolve import map from map file", async () => {
      const importMap = await resolveImportMap(cwd);
      assert(importMap);
    });
  });
});
