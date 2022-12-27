import { serve } from "https://deno.land/std@0.164.0/http/server.ts";
import { createServer } from "ultra/server.ts";

const importMapPath = Deno.env.get("ULTRA_MODE") === "development"
  ? "./importMap.dev.json"
  : "./importMap.json";
const server = await createServer({
  importMapPath: import.meta.resolve(importMapPath),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

server.get("*", (context) => {
  /**
   * Render the request
   */
  return context.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Ultra CSR</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/style.css">
        <script async src="https://ga.jspm.io/npm:es-module-shims@1.6.2/dist/es-module-shims.js" crossorigin="anonymous"></script>
        <script type="importmap">
            ${Deno.readTextFileSync(importMapPath)}
        </script>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/_ultra/compiler/client.tsx" async=""></script>
      </body>
    </html>
  `);
});

if (import.meta.main) {
  serve(server.fetch);
}

export default server;
