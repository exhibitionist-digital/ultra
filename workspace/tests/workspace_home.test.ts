import {
  assert,
  assertEquals,
  fail,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { Page } from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { launchLocalhostBrowser, startTestServer } from "./helpers.ts";

const expectations = [
  { text: "Ultra", selector: "h1" },
  { text: "un-bundle the web", selector: "h2" },
  { text: "This is a lazily loaded component", selector: "h3" },
];

// NOTES: (OM)
// Puppeteer tests, when split into async steps, can fail
// over and over on windows specifically. I split out steps
// into their own tests for this reason.

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

Deno.test("puppeteer: native server", async () => {
  const server = await startTestServer("server.js");
  const browser = await launchLocalhostBrowser();
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
  await browser.close();
  await server.close();
});

Deno.test("puppeteer: oak server", async () => {
  const server = await startTestServer("oak.ts");
  const browser = await launchLocalhostBrowser();

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

  await browser.close();
  await server.close();
});

Deno.test("puppeteer: oak server custom route", async () => {
  const server = await startTestServer("oak.ts");
  const browser = await launchLocalhostBrowser();

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

  await browser.close();
  await server.close();
});
