import { createGraph, emptyDir, ensureDir } from "./deps.ts";
import { vendor as vendorTransform } from "./transform.ts";
import { hashFile, isValidURL } from "./resolver.ts";

const vendorDirectory = Deno.env.get("dir") || "x";
const importMapPath = Deno.env.get("importMap") || "./importMap.json";
const importMap = JSON.parse(await Deno.readTextFile(importMapPath));

const vendor = async () => {
  // setup directories
  const directory = `.ultra/${vendorDirectory}`;
  await ensureDir(directory);
  await emptyDir(directory);

  // create a new object for the vendor import map
  const vendorMap: Record<string, string> = {};

  // for our original import map, loop through keys
  for (const key of Object.keys(importMap?.imports)) {
    if (!isValidURL(importMap?.imports[key])) {
      vendorMap[key] = importMap?.imports[key];
      continue;
    }
    const p = new URL(importMap?.imports[key]);
    // these params force the 'browser' imports
    // these will work in BOTH deno and browser
    p.searchParams.append("target", "es2021");
    p.searchParams.append("no-check", "true");

    // create graph call
    const graph = await createGraph(p.toString());
    const { modules } = graph.toJSON();

    // loop through specifiers
    for (const { specifier } of modules) {
      const path = specifier;
      if (path) {
        if (!isValidURL(path)) continue;
        const url = new URL(path);
        console.log(`Vendoring ${path}`);
        const file = await fetch(path);
        const text = await file.text();
        const hash = hashFile(url.pathname);
        await Deno.writeTextFile(
          `${directory}/${hash}.js`,
          vendorTransform({
            source: text,
            root: ".",
          }),
        );
        vendorMap[key] = `./.ultra/${vendorDirectory}/${hash}.js`;
      }
    }
  }

  Deno.writeTextFile(`vendorMap.json`, JSON.stringify({ imports: vendorMap }));
};

vendor();
