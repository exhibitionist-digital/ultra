import {
  dirname,
  globToRegExp,
  join,
} from "https://deno.land/std@0.153.0/path/mod.ts";
import { ensureDir, walk } from "https://deno.land/std@0.153.0/fs/mod.ts";
import { compile } from "https://esm.sh/@mdx-js/mdx@2.1.3/lib/compile.js";

const MDX_MATCH = globToRegExp("**/*.mdx", {
  extended: true,
  globstar: true,
  caseInsensitive: false,
});

/**
 * Walk the ./content directory for every .mdx file compile it to Javascript
 * Save the output to ./src/content/[path]
 */
for await (
  const entry of walk("./content", {
    match: [MDX_MATCH],
  })
) {
  if (entry.isFile) {
    const content = await Deno.readTextFile(entry.path);

    const compiled = await compile(content, {
      jsxRuntime: "automatic",
      jsxImportSource: "react",
      providerImportSource: "@mdx-js/react",
    });

    const outputPath = join(
      Deno.cwd(),
      "src",
      entry.path.replace(".mdx", ".js"),
    );

    await ensureDir(dirname(outputPath));
    await Deno.writeTextFile(outputPath, compiled.value.toString());
  }
}

/**
 * Now execute the dev task
 */
const server = Deno.run({
  cmd: [Deno.execPath(), "task", "dev"],
});

await server.status();
