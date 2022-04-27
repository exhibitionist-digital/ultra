import { resolveEnv } from "./resolveEnv.ts";
import { assertEquals } from "./deps.dev.ts";

Deno.test("resolveEnv", async (t) => {
  await t.step("defaults are correct", () => {
    const env = resolveEnv();

    assertEquals(env, {
      apiDirectory: "src/api",
      disableStreaming: false,
      lang: "en",
      mode: null,
      origin: "http://localhost:8000",
      port: 8000,
      root: "http://localhost:8000",
      sourceDirectory: "src",
      vendorDirectory: "x",
    });
  });

  await t.step("legacy", () => {
    const env = resolveEnv({
      root: "https://example.com",
      mode: "test",
      source: "source",
      vendor: "vendor",
      api: "cool/api",
      lang: "simlish",
    });

    assertEquals(env, {
      origin: "https://example.com",
      root: "https://example.com",
      mode: "test",
      port: 8000,
      disableStreaming: false,
      sourceDirectory: "source",
      vendorDirectory: "vendor",
      apiDirectory: "cool/api",
      lang: "simlish",
    });
  });

  await t.step("ULTRA_ prefixes", () => {
    const env = resolveEnv({
      ULTRA_ORIGIN: "https://example.com",
      ULTRA_MODE: "test",
      ULTRA_SRC: "source",
      ULTRA_VENDOR: "vendor",
      ULTRA_API_SRC: "cool/api",
      ULTRA_LOCALE: "simlish",
    });

    assertEquals(env, {
      origin: "https://example.com",
      root: "https://example.com",
      mode: "test",
      port: 8000,
      disableStreaming: false,
      sourceDirectory: "source",
      vendorDirectory: "vendor",
      apiDirectory: "cool/api",
      lang: "simlish",
    });
  });
});
