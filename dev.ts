import { parse } from "https://deno.land/std@0.139.0/flags/mod.ts";
import { assert } from "https://deno.land/std@0.134.0/testing/asserts.ts";
import { dirname, readLines, resolve } from "./src/deps.ts";

assert(Deno.args[0], "No entrypoint was provided");

const args = parse(Deno.args, {
  boolean: ["debug"],
});

const mainModule = resolve(Deno.cwd(), Deno.args[0]);
/**
 * Current working directory of the main module.
 */
const cwd = dirname(mainModule);
const env = Deno.env.toObject();

/**
 * Setup the environment for development
 */
env["ULTRA_MODE"] = "development";

if (args.debug) {
  env["DEBUG"] = "*";
}

/**
 * Start the process
 */
const process = Deno.run({
  cwd,
  cmd: [
    Deno.execPath(),
    "run",
    "-A",
    "--unstable",
    "--no-check",
    mainModule,
  ],
  env,
  stderr: "piped",
  stdout: "piped",
});

/**
 * Capture stderr and stdout
 */
stderr(process);
stdout(process);

await process.status;

async function stderr(process: Deno.Process) {
  // process.stderr/stdout types declare that they can return null for some reason.
  if (process.stderr === null) {
    throw new Error("Failed to initialize stderr stream!");
  }

  for await (const line of readLines(process.stderr)) {
    console.error(line);
  }
}

async function stdout(process: Deno.Process) {
  // process.stderr/stdout types declare that they can return null for some reason.
  if (process.stdout === null) {
    throw new Error("Failed to initialize stdout stream!");
  }

  for await (const line of readLines(process.stdout)) {
    console.log(line);
  }
}
