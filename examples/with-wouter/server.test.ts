import { assertEquals } from "https://deno.land/std@0.176.0/testing/asserts.ts";
import server from "./server.tsx";

async function testRenderedContainsText(location: string, text: string) {
  const response = await server.request(location);
  const content = await response.text();

  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("content-type"),
    "text/html; charset=utf-8",
  );

  assertEquals(content.includes(text), true);
}

/**
 * This is here as an example of how to test your
 * server/rendering.
 */
Deno.test("it works", async (t) => {
  await t.step("it can render the homepage", async () => {
    await testRenderedContainsText("http://localhost/", "Home page");
  });

  await t.step("it can render the about page", async () => {
    await testRenderedContainsText("http://localhost/about", "About page");
  });
});
