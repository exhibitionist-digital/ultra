import { join } from "../lib/deps.ts";
import { initExampleConfig } from "./dev.ts";

async function testExample(example: string) {
  try {
    const examplePath = join("examples", example);
    await initExampleConfig(example);
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "test",
        "-c",
        "deno.dev.json",
        "-A",
        "--no-check",
      ],
      cwd: examplePath,
      env: {
        ULTRA_MODE: "development",
      },
    });
    const process = command.spawn();

    console.log("test ", examplePath);

    const status = await process.status;
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
