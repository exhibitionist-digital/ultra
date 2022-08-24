import { ensureDir, join, outdent } from "../../lib/build/deps.ts";
import build from "../../build.ts";

await build({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
  plugin: {
    name: "netlify-edge",
    async onBuild(result) {
      console.log(result);

      const outputDir = join(result.paths.rootDir, ".netlify");
      const edgeFunctionsDir = join(outputDir, "edge-functions");

      await ensureDir(outputDir);
      await ensureDir(edgeFunctionsDir);

      await Deno.writeTextFile(
        join(edgeFunctionsDir, "server.ts"),
        `export default () => new Response("Hello world");`,
      );

      await Deno.writeTextFile(
        join(outputDir, "netlify.toml"),
        outdent`
          [[edge_functions]]
          path = "/*"
          function = "server"
        `,
      );
    },
  },
});
