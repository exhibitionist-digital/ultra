import type { Plugin } from "../../types.ts";

export const devPlugin: Plugin = (app) => {
  queueMicrotask(async () => {
    const sources = await app.resolveSources();
    const watcher = Deno.watchFs(
      Array.from(sources.keys()).map((pathname) => new URL(pathname).pathname),
      { recursive: true },
    );

    for await (const event of watcher) {
      console.log(event);
      //   watchChannel.postMessage(event);
    }
  });
};
