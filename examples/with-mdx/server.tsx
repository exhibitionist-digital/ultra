import { serve } from "https://deno.land/std@0.153.0/http/server.ts";
import { walk } from "https://deno.land/std@0.153.0/fs/walk.ts";
import { compile } from "https://esm.sh/@mdx-js/mdx@2.1.3/lib/compile.js";
import { createRouter, createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

const mdxRouter = createRouter();

for await (const entry of walk("./mdx")) {
  if (entry.isFile) {
    const content = await Deno.readTextFile(entry.path);

    const compiled = await compile(content, {
      jsxRuntime: "automatic",
      jsxImportSource: "react",
      providerImportSource: "@mdx-js/react",
    });

    const path = entry.path.replace(".mdx", ".js").replace("mdx/", "/");

    mdxRouter.get(path, () => {
      return new Response(compiled.value.toString(), {
        headers: {
          "content-type": "text/javascript",
        },
      });
    });
  }
}

server.route("/mdx", mdxRouter);

server.get("*", async (context) => {
  /**
   * Render the request
   */
  const result = await server.render(<App />);

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
