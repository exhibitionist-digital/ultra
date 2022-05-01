import {
  isRemoteSource,
  isValidUrl,
  isVendorSource,
  replaceFileExt,
  resolveFileUrl,
  stripTrailingSlash,
} from "./resolver.ts";
import { hashFile } from "./hashFile.ts";
import { assert, assertEquals } from "./deps.dev.ts";

Deno.test("hashFile", () => {
  const hash = hashFile("https://esm.sh/react");
  assertEquals(
    hash,
    `react.8ca2952001a498bd`,
  );
});

Deno.test("isValidUrl", async (t) => {
  await t.step("valid url", () => {
    assert(isValidUrl("https://ultrajs.dev"));
  });
  await t.step("invalid url", () => {
    assert(!isValidUrl("./app.jsx"));
  });
});

Deno.test("isVendorSource", async (t) => {
  await t.step("valid vendor", () => {
    assert(isVendorSource("./.ultra/x/react.js", "x"));
  });
  await t.step("invalid vendor", () => {
    assert(!isVendorSource("./components/Heading.jsx", "x"));
  });
});

Deno.test("isRemoteSource", async (t) => {
  await t.step("valid remote", () => {
    assert(isRemoteSource("https://deno.land/x/foo"));
    assert(isRemoteSource("http://example.com"));
  });
  await t.step("invalid remote", () => {
    assert(!isRemoteSource("file:///path/to/Heading.jsx"));
  });
});

Deno.test("resolvers", async (t) => {
  await t.step("replace file extension", () => {
    assertEquals(replaceFileExt("app.jsx", ".ts"), "app.ts");
    assertEquals(replaceFileExt("./app.jsx", ".js"), "./app.js");
    assertEquals(replaceFileExt("./app.js", ".jsx"), "./app.jsx");
    assertEquals(replaceFileExt("./app.jsx", ".tsx"), "./app.tsx");
    assertEquals(replaceFileExt("app", ".ts"), "app.ts");
    assertEquals(replaceFileExt("app.", ".ts"), "app.ts");
    assertEquals(
      replaceFileExt("/foo/bar/baz/app.js", ".ts"),
      "/foo/bar/baz/app.ts",
    );
    assertEquals(
      replaceFileExt("/absolute/test.jsx.foo/app.jsx", ".js"),
      "/absolute/test.jsx.foo/app.js",
    );
    assertEquals(replaceFileExt("app.js", ".js"), "app.js");
  });
  await t.step("strip trailing slash", () => {
    assertEquals(
      stripTrailingSlash("https://ultrajs.dev/"),
      "https://ultrajs.dev",
    );
  });
  await t.step("resolveFileUrl", () => {
    const url = resolveFileUrl("foo", "bar");
    assert(url.href.endsWith("/foo/bar"));
    assert(url.href.startsWith("file:///"));
  });
});
