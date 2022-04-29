import { devServerWebsocketPort, sourceDirectory } from "./env.ts";
import { readLines, serve } from "./deps.ts";

export type DevServerOptions = {
  /** Path to a script that initializes the server. eg. "./server.js" */
  server: string;
};

const listeners = new Set<WebSocket>();
let process: Deno.Process;
const options = {} as DevServerOptions;

const runServer = (): Deno.Process => {
  const process = Deno.run({
    cmd: [
      "deno",
      "run",
      "-A",
      "--unstable",
      "--no-check",
      options.server,
    ],
    stderr: "piped",
    stdout: "piped",
  });

  stderr(process);
  output(process);

  return process;
};

const stderr = async (process: Deno.Process) => {
  // process.stderr/stdout types declare that they can return null for some reason.
  if (process.stderr === null) {
    throw new Error("Failed to initialize stderr stream!");
  }

  for await (const line of readLines(process.stderr)) {
    console.error(line);
  }
};

const output = async (process: Deno.Process) => {
  // process.stderr/stdout types declare that they can return null for some reason.
  if (process.stdout === null) {
    throw new Error("Failed to initialize stdout stream!");
  }

  for await (const line of readLines(process.stdout)) {
    console.log(line);
    if (line.startsWith("Ultra running")) {
      // notify listeners
      reloading = false;
      for (const socket of listeners) {
        socket.send("reload");
      }
    }
  }
};

let reloading = false;

const reloadServer = () => {
  if (reloading) return;

  reloading = true;
  console.log("Reloading server...");

  process.kill("SIGINT");
  process = runServer();

  output(process);
};

// async file watcher to send socket messages
const watcher = async () => {
  for await (
    const { kind } of Deno.watchFs(sourceDirectory, { recursive: true })
  ) {
    if (kind === "modify" || kind === "create") {
      reloadServer();
    }
  }
};

const devServer = (userOptions: DevServerOptions) => {
  options.server = userOptions.server;
  process = runServer();

  watcher();

  serve((request: Request): Response => {
    const { socket, response } = Deno.upgradeWebSocket(request);
    listeners.add(socket);
    socket.onclose = () => {
      listeners.delete(socket);
    };
    return response;
  }, { port: Number(devServerWebsocketPort) });
};

export default devServer;
