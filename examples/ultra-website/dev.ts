import { compile } from "./mdx.ts";

await compile("./content");

/**
 * Now start the server
 */
const command = new Deno.Command(Deno.execPath(), {
  args: [
    "run",
    "-A",
    "--location=http://localhost:8000",
    "./server.tsx",
  ],
});
const server = command.spawn();

await server.status;
