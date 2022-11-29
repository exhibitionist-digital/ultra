import { serve } from "https://deno.land/std@0.164.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import { createHeadInsertionTransformStream } from "ultra/stream.ts";
import { stringify, tw } from "./src/twind/twind.ts";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

server.get("*", async (context) => {
// Inject the style tag into the head of the streamed response
const stylesInject = createHeadInsertionTransformStream(() => {
if (Array.isArray(tw.target)) {
  return Promise.resolve(stringify(tw.target));
}

throw new Error("Expected tw.target to be an instance of an Array");
});

const transformed = result.pipeThrough(stylesInject);

return context.body(transformed, 200, {
"content-type": "text/html; charset=utf-8",
});

});

if (import.meta.main) {
  serve(server.fetch);
}

export default server;
