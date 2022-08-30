import { compile } from "./mdx.ts";

await compile("./content");

/**
 * Now start the server
 */
const server = Deno.run({
  cmd: [Deno.execPath(), "run", "-A", "./server.tsx"],
});

await server.status();
