import { serve } from "https://deno.land/std@0.139.0/http/server.ts";
import { toFileUrl } from "../../deps.ts";
import { dev } from "../../broadcast.ts";
import type { Plugin } from "../../types.ts";

export const devPlugin: Plugin = (app) => {
  const listeners = new Set<WebSocket>();

  queueMicrotask(async () => {
    const sourceFiles = await app.resolveSources();

    const watcher = Deno.watchFs(
      sourceFiles.watchTargets(),
      { recursive: true },
    );

    for await (const event of watcher) {
      if (event.kind === "modify") {
        for (const path of event.paths) {
          app.sourceFiles.invalidate(toFileUrl(path));
        }
      }
      dev.postMessage({ type: "reload", paths: event.paths });
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
