// @ts-nocheck todo: add types

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
  const vendorMap = {};
  for (const key of Object.keys(importMap?.imports)) {
    if (!isValidURL(importMap?.imports[key])) {
      vendorMap[key] = importMap?.imports[key];
      continue;
    }
    const p = new URL(importMap?.imports[key]);
    p.searchParams.append("target", "es2021");
    p.searchParams.append("no-check", 1);
    const graph = await createGraph(p);
    const { modules } = graph.toJSON();
    for (const { specifier } of modules) {
      const path = specifier;
      if (path) {
        if (!isValidURL(path)) continue;
        const url = new URL(path);
        console.log(`Vendoring ${path}`);
        const file = await fetch(path);
        const text = await file.text();
        const directory = `.ultra/${vendorDirectory}`;
        await ensureDir(directory);
        const hash = hashFile(url.pathname);
        const content = vendorTransform({ source: text, root: ".", url });
        await Deno.writeTextFile(
          `${directory}/${hash}.js`,
          content,
        );
        vendorMap[key] = `./.ultra/${vendorDirectory}/${hash}.js`;
      }
    }
  }

  Deno.writeTextFile(`vendorMap.json`, JSON.stringify({ imports: vendorMap }));
};

vendor();
