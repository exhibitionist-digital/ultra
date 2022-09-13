import { serve } from "https://deno.land/std@0.155.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.155.0/http/file_server.ts";
import { join } from "https://deno.land/std@0.155.0/path/mod.ts";

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

type ImportMap = {
  imports: Record<string, string>;
};

/**
 * Start the dev file server
 */
serve((request) => {
  return serveDir(request, {
    showDirListing: true,
    showDotfiles: false,
    quiet: true,
  });
}, {
  port: 4507,
  async onListen({ port, hostname }) {
    const examples: string[] = [];
    for await (const entry of Deno.readDir("examples")) {
      if (entry.isDirectory) {
        examples.push(entry.name);
      }
    }
    const examplesSorted = examples.sort();

    const example = await ask(
      `What example are you working on? ${
        examplesSorted.map((example, index) => `\n(${index}) ${example}`)
      }\n`,
      examplesSorted,
    );

    console.log(example);

    try {
      const examplePath = join("examples", example);
      const devConfigPath = join(examplePath, "deno.dev.json");
      const devImportMapPath = join(examplePath, "importMap.dev.json");

      const config: Record<string, string> = JSON.parse(
        await Deno.readTextFile(join(examplePath, "deno.json")),
      );

      const importMap: ImportMap = JSON.parse(
        await Deno.readTextFile(
          join(examplePath, "importMap.json"),
        ),
      );

      importMap.imports["ultra/"] = `http://localhost:${port}/`;
      config.importMap = "importMap.dev.json";

      await Deno.writeTextFile(devConfigPath, JSON.stringify(config, null, 2));
      await Deno.writeTextFile(
        devImportMapPath,
        JSON.stringify(importMap, null, 2),
      );

      console.log(`Dev file server listening http://${hostname}:${port}`);

      /**
       * Run the server with generated dev config
       */
      const process = Deno.run({
        cmd: [
          Deno.execPath(),
          "run",
          "-A",
          "--watch",
          "--reload",
          "--config",
          "deno.dev.json",
          "./server.tsx",
        ],
        cwd: examplePath,
      });

      await process.status();
    } catch (error) {
      console.error(error);
      Deno.exit(1);
    }
  },
});
