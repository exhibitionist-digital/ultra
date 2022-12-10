import { build } from "unocss/cli";

let process: Deno.Process;
let reloading = false;

async function dev() {
  await build({
    patterns: ["src/**/*"],
    outFile: "public/uno.css",
  });
  const server = Deno.run({
    cmd: [
      Deno.execPath(),
      "run",
      "-A",
      "--location=http://localhost:8000",
      "./server.tsx",
    ],
  });
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
const watcher = Deno.watchFs(["."]);
for await (const { kind } of watcher) {
  if (kind === "modify" || kind === "create") {
    reload();
  }
}
