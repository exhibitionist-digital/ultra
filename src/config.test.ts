import { resolveConfig, resolveImportMap } from "./config.ts";
import { Config } from "./types.ts";
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
      assert(config.importMap);
    });
  });

  describe("resolveImportMap", () => {
    it("should resolve import map from env var", async () => {
      Deno.env.set("importMap", "./importMap.test.json");
      const importMap = await resolveImportMap(cwd);
      Deno.env.delete("importMap");
      assert(importMap.imports.react);
      assert(!importMap.imports.asdffgg);
    });
    it("should resolve import map from config object", async () => {
      Deno.env.delete("importMap");
      const config: Config = { importMap: "./importMap.test.json" };
      const importMap = await resolveImportMap(cwd, config);
      assert(importMap.imports.react);
      assert(!importMap.imports.asdffgg);
    });
  });
});
