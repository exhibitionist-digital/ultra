import { join } from "../lib/deps.ts";
import { initExampleConfig } from "./dev.ts";

async function testExample(example: string) {
  try {
    const examplePath = join("examples", example);
    const cmd = [
      Deno.execPath(),
      "test",
      "-c",
      "deno.dev.json",
      "-A",
    ];
    console.log("test ", examplePath, cmd);
    await initExampleConfig(example);
    const process = Deno.run({
      cmd,
      cwd: examplePath,
      env: {
        ULTRA_MODE: "development",
      },
    });

    const status = await process.status();
    if (status.code > 0) {
      Deno.exit(status.code);
    }
  } catch (err) {
    console.error(err);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  for (const example of Deno.args) {
    await testExample(example);
  }
}
