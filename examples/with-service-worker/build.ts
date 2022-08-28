import build from "ultra/build.ts";

await build({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
  exclude: ["./README.md", "./build.ts"],
  plugin: {
    name: "service-worker",
    async onBuild(builder, result) {
      const serviceWorkerSource = await result.sources.get(
        "./public/service-worker.js",
      );

      const serviceWorker = await serviceWorkerSource.read();

      const cacheManifest = builder.toManifest(result.compiled, {
        exclude: [
          "./public/service-worker.js",
        ],
        prefix: "/",
      });

      if (serviceWorker) {
        const cacheUrls = cacheManifest.map(([, compiled]) => compiled);
        const replacedSource = serviceWorker.replace(
          "__ULTRA_CACHE_URLS",
          JSON.stringify(cacheUrls),
        );

        /**
         * Write the changes to .ultra/public/service-worker.js
         */
        await serviceWorkerSource.write(replacedSource);
      }
    },
  },
});
