import { dirname, fromFileUrl, join } from "../../deps.ts";
import { ensureDir } from "../deps.ts";
import type { BuildPlugin } from "../types.ts";

export const netlify: BuildPlugin = {
  name: "netlify-edge",
  async onBuild(builder) {
    const __dirname = join(
      dirname(fromFileUrl(new URL(import.meta.url))),
      "netlify",
    );

    const dotEdgeFunctionsDir = join(
      builder.context.output,
      ".netlify",
      "edge-functions",
    );

    const edgeFunctionsDir = join(
      builder.context.output,
      "netlify",
      "edge-functions",
    );

    await ensureDir(dotEdgeFunctionsDir);
    await ensureDir(edgeFunctionsDir);

    await Deno.copyFile(
      join(__dirname, "server.js"),
      join(edgeFunctionsDir, "index.js"),
    );

    await Deno.writeTextFile(
      join(dotEdgeFunctionsDir, "manifest.json"),
      JSON.stringify(
        {
          functions: [
            {
              function: "index",
              pattern: "^[^.]*$",
            },
          ],
          version: 1,
        },
        null,
        2,
      ),
    );
  },
};
