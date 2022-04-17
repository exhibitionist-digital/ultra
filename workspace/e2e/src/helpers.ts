import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { join } from "https://deno.land/std@0.135.0/path/mod.ts";
import { readLines } from "https://deno.land/std@0.135.0/io/mod.ts";
import { fail } from "https://deno.land/std@0.135.0/testing/asserts.ts";

export async function startTestServer() {
  const serverProcess = Deno.run({
    cmd: ["deno", "task", "start"],
    cwd: join(Deno.cwd(), "./workspace"),
    stdout: "piped",
    stderr: "piped",
  });

  console.log("Waiting for server to start...");

  /**
   * Theres probably a better way of doing this...
   */
  for await (const line of readLines(serverProcess.stdout)) {
    if (line.includes("Ultra running")) {
      console.log(line);
      return serverProcess;
    }
  }

  serverProcess.close();
}

export async function launchLocalhostBrowser() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    return browser;
  } catch (error) {
    fail(error);
  }
}
