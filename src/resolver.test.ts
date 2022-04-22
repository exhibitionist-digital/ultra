import {
  hashFile,
  isValidUrl,
  isVendorSource,
  replaceFileExt,
  stripTrailingSlash,
} from "./resolver.ts";
import { assertEquals } from "./deps.ts";

Deno.test("hashFile", () => {
  const hash = hashFile("https://esm.sh/react");
  assertEquals(
    hash,
    `8ca2952001a498bd682ddd3c98f70920ce4fdaa3b326d23d5d66a6d338c6efdd`,
  );
});

Deno.test("isValidUrl", async (t) => {
  await t.step("valid url", () => {
    assertEquals(!!isValidUrl("https://ultrajs.dev"), true);
  });
  await t.step("invalid url", () => {
    assertEquals(isValidUrl("./app.jsx"), false);
  });
});

Deno.test("isVendorSource", async (t) => {
  await t.step("valid vendor", () => {
    assertEquals(isVendorSource("./.ultra/x/react.js", "x"), true);
  });
  await t.step("invalid vendor", () => {
    assertEquals(isVendorSource("./components/Heading.jsx", "x"), false);
  });
});

Deno.test("resolvers", async (t) => {
  await t.step("replaceFileExt", () => {
    assertEquals(replaceFileExt("a.tsx", ".js"), "/a.js");
    assertEquals(replaceFileExt("/a.ts", ".js"), "/a.js");
    assertEquals(replaceFileExt("/a/b/c.js", ".ts"), "/a/b/c.ts");
    assertEquals(replaceFileExt("./app.jsx", ".js"), "./app.js");
    assertEquals(
      replaceFileExt("/absolute/test.jsx.foo/app.jsx", ".js"),
      "/absolute/test.jsx.foo/app.js",
    );
  });
  await t.step("strip trailing slash", () => {
    assertEquals(
      stripTrailingSlash("https://ultrajs.dev/"),
      "https://ultrajs.dev",
    );
  });
});
