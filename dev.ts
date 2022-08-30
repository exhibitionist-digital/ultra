import {
  join,
  SEP,
  toFileUrl,
} from "https://deno.land/std@0.153.0/path/mod.ts";

const cwd = join(Deno.cwd(), SEP);
const watcher = Deno.watchFs(cwd);

const mainWorker = new Worker(
  new URL(Deno.args[0], toFileUrl(cwd)).href,
  {
    type: "module",
    name: "main",
  },
);

for await (const event of watcher) {
  if (event.kind === "modify") {
    mainWorker.postMessage({ type: "reload" });
  }
}
