import { assertEquals } from "https://deno.land/std@0.176.0/testing/asserts.ts";
import server from "./server.tsx";

Deno.test(
  "server works in development mode",
  { sanitizeResources: false, sanitizeOps: false },
  async (t) => {
    const response = await server.request("http://localhost/");
    const content = await response.text();

    await t.step("it can render the homepage", () => {
      assertEquals(response.status, 200);
      assertEquals(
        response.headers.get("content-type"),
        "text/html; charset=utf-8",
      );

      assertEquals(content.includes("<strong>Ultra</strong>"), true);
    });

    await t.step("it has an importMap", () => {
      assertEquals(content.includes('<script type="importmap">'), true);
    });

    await t.step("it can render the homepage", async () => {
      const response = await server.request("http://localhost/");
      const content = await response.text();

      assertEquals(response.status, 200);
      assertEquals(
        response.headers.get("content-type"),
        "text/html; charset=utf-8",
      );

      assertEquals(content.includes("<strong>Ultra</strong>"), true);
    });

    await t.step("it can serve static assets from '/public'", async () => {
      const response = await server.request("https://localhost/style.css");
      response.body?.cancel();

      assertEquals(response.status, 200);
      assertEquals(
        response.headers.get("content-type"),
        "text/css; charset=utf-8",
      );
    });
  },
);
