import {
  dirname,
  fromFileUrl,
  join,
  toFileUrl,
} from "https://deno.land/std@0.167.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.168.0/fs/ensure_dir.ts";
import { walk } from "https://deno.land/std@0.168.0/fs/walk.ts";
import { serve } from "https://deno.land/std@0.167.0/http/mod.ts";
import { deferred } from "https://deno.land/std@0.167.0/async/deferred.ts";
import { debounce } from "https://deno.land/std@0.167.0/async/mod.ts";
import { channel } from "./channel.ts";
import { log } from "../logger.ts";

let mainWorker: Worker;
let webSocket: WebSocket;

function websocketHandler(request: Request) {
  if (request.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(request);
  webSocket = socket;

  socket.addEventListener("message", (event) => {
    if (event.data === "ping") {
      socket.send("pong");
    }
    if (event.data === "reload") {
      channel.addEventListener("message", () => {
        socket.send("reload");
      });
    }
  });

  return response;
}

serve(websocketHandler, {
  port: 8080,
  onListen({ hostname, port }) {
    log.info(`Dev server listening on ${hostname}:${port}`);
  },
});

type CreateDevOptions = {
  output?: string;
};

export function createDev(options?: CreateDevOptions) {
  const mainModule = fromFileUrl(import.meta.resolve(Deno.mainModule));
  const rootDir = dirname(mainModule);

  const workingDir = options?.output || Deno.makeTempDirSync({
    prefix: `ultra_dev_`,
  });

  const watcher = new Worker(new URL("./watcher.ts", import.meta.url), {
    type: "module",
    //@ts-ignore unstable api
    deno: {
      permissions: "inherit",
    },
  });

  function getWorkingDirPath(path: string) {
    return join(workingDir, path.replace(rootDir, "."));
  }

  async function copyToWorkingDir(path: string) {
    const workingDirPath = getWorkingDirPath(path);
    await ensureDir(dirname(workingDirPath));

    // log.debug("copyToWorkingDir", {
    //   path,
    //   workingDirPath,
    // });

    await Deno.copyFile(path, workingDirPath);
    return toFileUrl(workingDirPath);
  }

  let watcherListener: (event: MessageEvent<Deno.FsEvent>) => void;

  function createWorker(entrypoint: URL) {
    if (mainWorker) {
      log.debug("restarting");
      mainWorker.terminate();
    } else {
      log.debug("createWorker");
    }

    if (watcherListener) {
      log.debug("removing old listener");
      watcher.removeEventListener("message", watcherListener);
    }

    watcherListener = debounce(
      async function (event: MessageEvent<Deno.FsEvent>) {
        if (event.data.kind === "create" || event.data.kind === "modify") {
          await Promise.all(
            event.data.paths.map((path) => copyToWorkingDir(path)),
          );
        } else if (event.data.kind === "remove") {
          await Promise.all(
            event.data.paths.map((path) =>
              Deno.remove(getWorkingDirPath(path))
            ),
          );
        }
        mainWorker = createWorker(entrypoint);
        webSocket?.send("reload");
      },
      100,
    );

    watcher.addEventListener("message", watcherListener);

    entrypoint.searchParams.append("ts", String(new Date().getTime()));

    return new Worker(entrypoint, {
      type: "module",
      name: "ultra-dev",
      //@ts-ignore unstable api
      deno: { permissions: "inherit" },
    });
  }

  return async function dev(entrypointPath: string) {
    Deno.env.set("ULTRA_ROOT", workingDir);

    log.debug("dev context", {
      mainModule,
      rootDir,
      workingDir,
      entrypointPath,
    });

    const entrypoint = await copyToWorkingDir(fromFileUrl(entrypointPath));

    watcher.postMessage(rootDir);

    for await (const entry of walk(rootDir)) {
      if (entry.isFile) {
        await copyToWorkingDir(entry.path);
      }
    }

    function cleanup() {
      log.debug("\ncleanup");
      try {
        Deno.removeSync(workingDir, { recursive: true });
      } catch {
        // do nothing
      }
      mainWorker.terminate();
      log.debug("cleanup done");
    }

    const promise = deferred();

    mainWorker = createWorker(entrypoint);

    promise.then(cleanup);
    globalThis.addEventListener("unhandledrejection", cleanup);

    Deno.addSignalListener("SIGINT", () => {
      promise.then().finally(() => {
        log.debug("exiting");
        Deno.exit();
      });

      promise.resolve();
    });

    return promise;
  };
}
