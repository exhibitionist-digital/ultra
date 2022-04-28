import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { join } from "https://deno.land/std@0.135.0/path/mod.ts";
import { readLines } from "https://deno.land/std@0.135.0/io/mod.ts";

export async function startTestServer(taskName = "start") {
  const serverProcess = Deno.run({
    cmd: ["deno", "task", taskName],
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

      return {
        close() {
          serverProcess.stderr.close();
          serverProcess.stdout.close();
          serverProcess.kill("SIGTERM");
          serverProcess.close();
          return Promise.resolve();
        },
      };
    }
  }
}

export async function launchLocalhostBrowser() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    return browser;
  } catch (error) {
    throw error;
  }
}
