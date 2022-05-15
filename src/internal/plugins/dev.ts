import { serve } from "https://deno.land/std@0.139.0/http/server.ts";
import { toFileUrl } from "../../deps.ts";
import type { Plugin } from "../../types.ts";

export const devPlugin: Plugin = (app) => {
  const dev = new BroadcastChannel("dev");
  const listeners = new Set<WebSocket>();

  queueMicrotask(async () => {
    const sources = await app.resolveSources();
    const validWatchTargets = Array.from(sources.keys()).filter((pathname) =>
      !pathname.startsWith("http")
    );

    const watcher = Deno.watchFs(
      validWatchTargets.map((pathname) => new URL(pathname).pathname),
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

  app.addEventListener("listening", () => {
    serve((request: Request): Response => {
      const { socket, response } = Deno.upgradeWebSocket(request);
      listeners.add(socket);
      socket.onclose = () => {
        listeners.delete(socket);
      };
      return response;
    }, { port: Number(8001) });
  });
};
