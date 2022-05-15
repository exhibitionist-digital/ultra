import { toFileUrl } from "../../deps.ts";
import type { Plugin } from "../../types.ts";

export const devPlugin: Plugin = (app) => {
  const dev = new BroadcastChannel("dev");

  queueMicrotask(async () => {
    const sources = await app.resolveSources();
    const watcher = Deno.watchFs(
      Array.from(sources.keys()).map((pathname) => new URL(pathname).pathname),
      { recursive: true },
    );

    for await (const event of watcher) {
      if (event.kind === "modify") {
        for (const path of event.paths) {
          const url = toFileUrl(path);
          app.sources.invalidate(url.toString());
        }
      }
      dev.postMessage(event);
    }
  });
};
