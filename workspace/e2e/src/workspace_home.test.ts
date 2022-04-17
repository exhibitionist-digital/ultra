import {
  assertEquals,
  fail,
} from "https://deno.land/std@0.135.0/testing/asserts.ts";
import { launchLocalhostBrowser, startTestServer } from "./helpers.ts";

Deno.test("e2e", async (t) => {
  const server = await startTestServer();

  t.step(
    "Should render home page of workspace example app with expected text",
    async () => {
      const expectations = [
        { text: "ULTRA", selector: "h1" },
        { text: "component.jsx", selector: "h2" },
      ];

      let browser: Awaited<ReturnType<typeof launchLocalhostBrowser>>;

      try {
        browser = await launchLocalhostBrowser();

        const page = await browser.newPage();
        await page.setViewport({ width: 979, height: 865 });
        await page.goto("http://localhost:8000/");

        for (const expected of expectations) {
          const selection = await page.waitForSelector(expected.selector);
          if (selection) {
            const text = await page.evaluate(
              (element) => element.textContent,
              selection,
            );
            assertEquals(text, expected.text);
          } else {
            fail(`ERROR: Selector ${expected.selector} not found`);
          }
        }
      } catch (error) {
        fail(error.message);
      }

      await browser.close();
    },
  );

  server?.close();
});
