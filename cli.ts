import { Command } from "https://x.nest.land/cliffy@0.19.6/command/mod.ts";
import { copy } from "https://deno.land/std@0.104.0/io/util.ts";

const runDeno = (cmd: string) => {
  const p = Deno.run({
    cmd: cmd.split(" "),

    stdout: "piped",
    stderr: "piped",
  });

  copy(p.stdout, Deno.stdout);
  copy(p.stderr, Deno.stderr);
};

await new Command().name("ultra").version("0.6.0").description("CLI for Ultra")
  .command("dev", "Start a dev server")
  .option("-p,--port [port:number]", "Server port")
  .option("--importmap [importmap:string]", "Import map path")
  .option("--server [server:string]", "Server file")
  .option('-u, --url [url:string]', 'CDN Base URL')
  .action(
    (
      { port = 3000, importmap = "./importmap.json", server = "server.js", url = `http://localhost:${port}` }: {
        port: number;
        importmap: string;
        server: string;
        url: string
      },
    ) => {
      console.log(`Started dev server on http://localhost:${port}`);

      runDeno(
        `env mode=dev url=${url} port=${port} deno run --no-check --allow-net --allow-read --allow-env --allow-run --allow-write --import-map=${importmap} --unstable ${server}`,
      );
    },
  )
  .command("start", "Start a production server")
  .option("--port [port:number]", "Server port")
  .option("--importmap [importmap:string]", "Import map path")
  .option("--server [server:string]", "Server file")
  .option('-u, --url [url:string]', 'CDN Base URL')
  .action(
    (
      { port = 3000, importmap = "./importmap.json", server = "server.js", url = `http://localhost:${port}` }: {
        port: number;
        importmap: string;
        server: string;
        url: string
      },
    ) => {
      console.log(`Started production server on http://localhost:${port}`);
      runDeno(
        `env url=${url} port=${port} deno run --no-check --allow-net --allow-read --allow-env --allow-run --allow-write --import-map=${importmap} --unstable ${server}`,
      );
    },
  )
  .command('cache', 'Cache dependencies')
  .option("--server [server:string]", "Server file")
  .action(({server = 'server.js'}: {server: string}) => {
    runDeno(`deno cache --reload --no-check ${server}`)
  })
  .parse(Deno.args);
