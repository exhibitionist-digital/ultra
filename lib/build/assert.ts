import { crayon, sprintf } from "./deps.ts";

export async function assertEntrypointExists(
  path: string,
  entrypoint: "browser" | "server",
) {
  try {
    await Deno.readFile(path);
  } catch (cause) {
    throw new Error(
      sprintf(
        "Could not find your %s entrypoint %s, please check that it exists.",
        entrypoint,
        crayon.lightBlue(path),
      ),
      { cause },
    );
  }
}
