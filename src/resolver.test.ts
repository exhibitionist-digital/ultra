import {
  hashFile,
  isValidUrl,
  jsify,
  jsxify,
  stripTrailingSlash,
  tsify,
  tsxify,
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

Deno.test("resolvers", async (t) => {
  await t.step("jsify", () => {
    assertEquals(jsify("./app.jsx"), "./app.js");
  });
  await t.step("jsxify", () => {
    assertEquals(jsxify("./app.js"), "./app.jsx");
  });
  await t.step("tsify", () => {
    assertEquals(tsify("./app.js"), "./app.ts");
  });
  await t.step("tsxify", () => {
    assertEquals(tsxify("./app.jsx"), "./app.tsx");
  });
  await t.step("strip trailing slach", () => {
    assertEquals(
      stripTrailingSlash("https://ultrajs.dev/"),
      "https://ultrajs.dev",
    );
  });
});
