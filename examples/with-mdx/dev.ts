import { compile } from "./mdx.ts";

await compile("./content");

/**
 * Now start the server
 */
const command = new Deno.Command(Deno.execPath(), {
  args: [
    "run",
    "-A",
    "./server.tsx",
  ],
});

const server = command.spawn();

await server.status;
