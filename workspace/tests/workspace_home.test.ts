import {
  assert,
  assertEquals,
  fail,
} from "https://deno.land/std@0.135.0/testing/asserts.ts";
import { Browser, Page } from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { launchLocalhostBrowser, startTestServer } from "./helpers.ts";

const expectations = [
  { text: "Ultra", selector: "h1" },
  { text: "un-bundle the web", selector: "h2" },
  { text: "This is a lazily loaded component", selector: "h3" },
];

async function assertExpectedPageElements(page: Page) {
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
}

async function cleanup(
  browser: Browser,
  server: Awaited<ReturnType<typeof startTestServer>>,
) {
  await server.close();
  await browser.close();
}

Deno.test({ name: "puppeteer: native server" }, async (t) => {
  const server = await startTestServer("server.js");
  const browser = await launchLocalhostBrowser();

  await t.step(
    "Should render home page of workspace example app with expected text",
    async () => {
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 979, height: 865 });
        await page.goto("http://localhost:8000/", {
          waitUntil: "networkidle0",
        });

        await assertExpectedPageElements(page);
      } catch (error) {
        throw error;
      }
    },
  );

  await cleanup(browser, server);
});

Deno.test("puppeteer: oak server", async (t) => {
  const server = await startTestServer("oak.ts");
  const browser = await launchLocalhostBrowser();

  await t.step(
    "Should render home page of workspace example app with expected text",
    async () => {
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 979, height: 865 });
        await page.goto("http://localhost:8000/", {
          waitUntil: "networkidle0",
        });

        await assertExpectedPageElements(page);
      } catch (error) {
        throw error;
      }
    },
  );

  await t.step("Should handle custom-route", async () => {
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 979, height: 865 });
      await page.goto("http://localhost:8000/custom-route", {
        waitUntil: "networkidle0",
      });

      const content = await page.content();
      assert(content.includes("Oak custom route!"));
    } catch (error) {
      throw error;
    }
  });

  await cleanup(browser, server);
});
