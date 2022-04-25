import { sourceDirectory, wsport } from "./env.ts";
import { readLines, serve } from "./deps.ts";

const listeners = new Set<WebSocket>();
let process;
const options = {};

const runServer = () => {
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

  output(process);

  return process;
};

const output = async (process) => {
  for await (const line of readLines(process.stderr)) {
    console.error(line);
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

const devServer = (userOptions = {}) => {
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
  }, { port: Number(wsport) });
};

export default devServer;
