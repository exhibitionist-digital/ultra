import { build } from "unocss/cli";

let process: Deno.Process;
let reloading = false;

async function dev() {
  await build({
    patterns: ["src/**/*"],
    outFile: "public/uno.css",
  });
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      "--location=http://localhost:8000",
      "./server.tsx",
    ],
  });
  const server = command.spawn();

  return server;
}

async function reload() {
  if (reloading) return;
  reloading = true;
  process.kill();
  process = await dev();
  reloading = false;
}

process = await dev();
const watcher = Deno.watchFs(["./src"]);
for await (const { kind } of watcher) {
  if (kind === "modify" || kind === "create") {
    await reload();
  }
}
