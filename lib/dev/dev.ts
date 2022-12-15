import {
  dirname,
  fromFileUrl,
  join,
  toFileUrl,
} from "https://deno.land/std@0.167.0/path/mod.ts";
import { serve } from "https://deno.land/std@0.167.0/http/mod.ts";
import { deferred } from "https://deno.land/std@0.167.0/async/deferred.ts";
import { debounce } from "https://deno.land/std@0.167.0/async/mod.ts";

let mainWorker: Worker;
let webSocket: WebSocket;

function websocketHandler(req: Request) {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  webSocket = socket;
  return response;
}

serve(websocketHandler, { port: 8080 });

export function createDev() {
  const mainModule = fromFileUrl(import.meta.resolve(Deno.mainModule));
  const rootDir = dirname(mainModule);

  const workingDir = Deno.makeTempDirSync({
    prefix: `ultra_dev_`,
  });

  const watcher = new Worker(new URL("./watcher.ts", import.meta.url), {
    type: "module",
    //@ts-ignore unstable api
    deno: {
      permissions: "inherit",
    },
  });

  async function copyToWorkingDir(path: string) {
    const workingDirPath = join(workingDir, path.replace(rootDir, "."));
    console.log("copyToWorkingDir", {
      path,
      workingDirPath,
    });
    await Deno.copyFile(path, workingDirPath);
    return toFileUrl(workingDirPath);
  }

  let watcherListener: (event: MessageEvent<Deno.FsEvent>) => void;

  function createWorker(entrypoint: URL) {
    console.log("createWorker");

    if (mainWorker) {
      console.log("terminating stale worker");
      mainWorker.terminate();
    }

    if (watcherListener) {
      console.log("removing old listener");
      watcher.removeEventListener("message", watcherListener);
    }

    watcherListener = debounce(
      async function (event: MessageEvent<Deno.FsEvent>) {
        await Promise.all(
          event.data.paths.map((path) => copyToWorkingDir(path)),
        );
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
    const entrypoint = await copyToWorkingDir(fromFileUrl(entrypointPath));

    watcher.postMessage(rootDir);

    // console.log({
    //   mainModule,
    //   rootDir,
    //   workingDir,
    //   entrypointPath,
    //   entrypoint,
    // });

    const promise = deferred();

    mainWorker = createWorker(entrypoint);

    promise.then(() => {
      console.log("\ncleanup");
      mainWorker.terminate();
      Deno.removeSync(workingDir, { recursive: true });
      console.log("cleanup done");
    });

    Deno.addSignalListener("SIGINT", () => {
      promise.then().finally(() => {
        console.log("exiting");
        Deno.exit();
      });

      promise.resolve();
    });

    return promise;
  };
}
