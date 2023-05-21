import { assertEquals } from "https://deno.land/std@0.176.0/testing/asserts.ts";
import server from "./server.tsx";

/**
 * This is here as an example of how to test your
 * server/rendering.
 */
Deno.test("it works", async (t) => {
  await t.step("it can render the AboutPage", async () => {
    const response = await server.request("http://localhost/about");
    const content = await response.text();

    assertEquals(response.status, 200);
    assertEquals(
      response.headers.get("content-type"),
      "text/html; charset=utf-8",
    );

    assertEquals(content.includes(`<div>About page</div>`), true);
  });
});
