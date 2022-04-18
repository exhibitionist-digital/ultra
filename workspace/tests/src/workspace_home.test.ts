import {
  assertEquals,
  fail,
} from "https://deno.land/std@0.135.0/testing/asserts.ts";
import { launchLocalhostBrowser, startTestServer } from "./helpers.ts";

Deno.test("puppeteer", async (t) => {
  const server = await startTestServer();
  const browser = await launchLocalhostBrowser();

  await t.step(
    "Should render home page of workspace example app with expected text",
    async () => {
      const expectations = [
        { text: "Ultra", selector: "h1" },
        { text: "un-bundle the web", selector: "h2" },
        { text: "This is a lazily loaded component", selector: "h3" },
      ];

      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 979, height: 865 });
        await page.goto("http://localhost:8000/", {
          waitUntil: "networkidle0",
        });

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
        throw error;
      }
    },
  );

  await browser.close();
  server?.close();
});
