import { crayon } from "https://deno.land/x/crayon@3.3.2/mod.ts";
import { join } from "https://deno.land/std@0.176.0/path/mod.ts";

type ImportMap = {
  imports: Record<string, string>;
};

/**
 * This tool helps with developing and contributing to Ultra. It will start a file server for serving
 * Ultra source, from the root of the workspace. It will ask which example the user
 * would like to work on, generate a `deno.dev.json` and `importMap.dev.json`
 * in that examples project directory, and run the ./server.tsx in dev mode.
 */
export async function initExampleConfig(example: string) {
  try {
    const examplePath = join("examples", example);
    const devConfigPath = join(examplePath, "deno.dev.json");
    const devImportMapPath = join(examplePath, "importMap.dev.json");

    const config: Record<string, string> = JSON.parse(
      await readTextFile(join(examplePath, "deno.json")),
    );

    const importMap: ImportMap = JSON.parse(
      await readTextFile(join(examplePath, "importMap.json")),
    );

    importMap.imports["ultra/"] = `../../`;
    config.importMap = "importMap.dev.json";

    await Deno.writeTextFile(devConfigPath, JSON.stringify(config, null, 2));
    await Deno.writeTextFile(
      devImportMapPath,
      JSON.stringify(importMap, null, 2),
    );
  } catch (error) {
    console.error(error);
    Deno.exit(1);
  }
}

/**
 * Start the dev example
 */
async function dev() {
  const examples: string[] = [];
  for await (const entry of Deno.readDir("examples")) {
    if (entry.isDirectory) {
      examples.push(entry.name);
    }
  }
  const examplesSorted = examples.sort();

  const example = await ask(
    `${crayon.lightBlue("Which example are you working on?")} ${
      examplesSorted.map((example, index) => `\n(${index}) ${example}`)
    }\n`,
    examplesSorted,
  );

  console.log("selected example:", example);

  try {
    const examplePath = join("examples", example);
    initExampleConfig(example);

    // Valid entrypoints for our examples
    const serverEntrypoints = [
      "./server.tsx",
      "./server.jsx",
      "./server.ts",
      "./server.js",
    ];

    /**
     * Find the entrypoint
     */
    const serverEntrypoint = await Promise.any<string>(
      serverEntrypoints.map((entrypoint) => {
        return new Promise((resolve, reject) => {
          const fileInfo = Deno.lstatSync(join(examplePath, entrypoint));
          if (fileInfo.isFile) {
            resolve(entrypoint);
          } else {
            reject();
          }
        });
      }),
    );

    /**
     * Run the server with generated dev config
     */

    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "-A",
        "--watch",
        "-c",
        "deno.dev.json",
        serverEntrypoint,
      ],
      cwd: examplePath,
      env: {
        ULTRA_MODE: "development",
      },
    });
    const process = command.spawn();

    await process.status;
  } catch (error) {
    console.error(error);
    Deno.exit(1);
  }
}

async function readTextFile(path: string) {
  try {
    return await Deno.readTextFile(path);
  } catch (err) {
    throw `Failed to read ${path}, ` + err.stack;
  }
}

async function ask<T = string>(question = ":", answers?: T[]) {
  await Deno.stdout.write(new TextEncoder().encode(question + " "));
  const buf = new Uint8Array(1024);
  const n = <number> await Deno.stdin.read(buf);
  const answer = new TextDecoder().decode(buf.subarray(0, n));
  if (answers) {
    return answers[parseInt(answer.trim())] || answers[0];
  }
  return answer.trim();
}

// main
if (import.meta.main) {
  dev();
}
