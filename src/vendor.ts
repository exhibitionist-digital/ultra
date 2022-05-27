import { emptyDir, ensureDir } from "./deps.ts";
import { createGraph } from "./deps.ts";
import { vendor as vendorTransform } from "./transform.ts";
import { isValidUrl } from "./resolver.ts";
import { resolveConfig, resolveImportMap } from "./config.ts";
import { vendorDirectory } from "./env.ts";
import { hashFile } from "./hashFile.ts";

const vendor = async (
  { dir = ".ultra", outputDir }: { dir: string; outputDir?: string },
) => {
  // setup directories
  const cwd = Deno.cwd();
  const config = await resolveConfig(cwd);
  const importMap = await resolveImportMap(cwd, config);

  await emptyDir(`./${dir}`);
  await ensureDir(
    `./${dir}/${outputDir ? outputDir + "/" : ""}${vendorDirectory}`,
  );
  const directory = `${dir}/${
    outputDir ? outputDir + "/" : ""
  }${vendorDirectory}`;

  // create a new object for the vendor import map
  const vendorMap: Record<string, string> = {};

  // for our original import map, loop through keys
  for (const key of Object.keys(importMap?.imports)) {
    if (!isValidUrl(importMap?.imports[key])) {
      vendorMap[key] = importMap?.imports[key];
      continue;
    }

    const p = new URL(importMap?.imports[key]);
    // these params force the 'browser' imports
    // these will work in BOTH deno and browser
    if (p.hostname.toLowerCase() === "esm.sh") {
      p.searchParams.delete("dev");
      p.searchParams.append("target", "es2021");
      p.searchParams.append("no-check", "1");
    }

    // create graph call
    const graph = await createGraph(p.toString(), {
      kind: "codeOnly",
    });

    const { modules } = graph.toJSON();

    // loop through specifiers
    for (const { specifier } of modules) {
      const path = specifier;
      if (path) {
        if (!isValidUrl(path)) continue;
        const url = new URL(path);
        console.log(`Vendoring ${path}`);
        const file = await fetch(path);
        const text = await file.text();
        const hash = hashFile(url.pathname);
        await Deno.writeTextFile(
          `${directory}/${hash}.js`,
          await vendorTransform({
            source: text,
            root: ".",
          }),
        );
        vendorMap[key] = `./${dir}/${vendorDirectory}/${hash}.js`;
      }
    }
  }

  return { imports: vendorMap };
};

export default vendor;
