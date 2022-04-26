import { bold, outdent, underline, yellow } from "./src/unstable/deps.ts";

export { unstable_ultra } from "./src/unstable/server.ts";
export { createUltraMiddleware as unstable_createUltraMiddleware } from "./src/unstable/oak/middleware.ts";
export * from "./src/unstable/types.ts";

console.warn(
  yellow(
    bold(outdent`Hey now! Looks like you're using unstable Ultra features.
    File any issues you encounter at ${
      underline(
        "https://github.com/exhibitionist-digital/ultra/issues/new?labels=unstable",
      )
    }`),
  ),
);
