import { createBuilder } from "ultra/build.ts";

const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
  plugin: {
    name: "service-worker",
    async onBuild(builder, result) {
      const serviceWorkerSource = await result.outputSources.get(
        "./public/service-worker.js",
      );

      const serviceWorker = await serviceWorkerSource.read();

      const cacheManifest = builder.toManifest(result.outputSources, {
        ignore: [
          "./public/service-worker.js",
        ],
        prefix: "/",
      });

      if (serviceWorker) {
        const cacheUrls = cacheManifest.map(([, compiled]) => compiled);
        const replacedSource = serviceWorker.replace(
          "__ULTRA_CACHE_URLS",
          cacheUrls.join(","),
        );

        /**
         * Write the changes to .ultra/public/service-worker.js
         */
        await serviceWorkerSource.write(replacedSource);
      }
    },
  },
});

builder.ignore([
  "./README.md",
  "./importMap.json",
  "./*.dev.json",
  "./*.test.ts",
]);

// deno-lint-ignore no-unused-vars
const result = await builder.build();
