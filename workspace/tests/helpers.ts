import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import type { Browser } from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { join } from "https://deno.land/std@0.135.0/path/mod.ts";
import { readLines } from "https://deno.land/std@0.135.0/io/mod.ts";

type StartServerReturn = {
  close: () => Promise<void>;
};

export async function startTestServer(
  entrypoint: string,
): Promise<StartServerReturn> {
  const serverProcess = Deno.run({
    cmd: ["deno", "run", "-A", "--unstable", "--no-check", entrypoint],
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
      break;
    }
  }

  return {
    async close(): Promise<void> {
      await serverProcess.stdout.close();
      await serverProcess.stderr.close();
      await serverProcess.close();
    },
  };
}

export async function launchLocalhostBrowser(): Promise<Browser> {
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
