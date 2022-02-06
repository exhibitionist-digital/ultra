// @ts-nocheck todo: add types

import staticFiles from "../static.ts";
import transform from "../transform.ts";
import graph from "../graph.ts";
import { emptyDir, ensureDir } from "https://deno.land/std/fs/mod.ts";

await emptyDir("./.ultra");

const build = async ({ root = "src", importMap, base }) => {
  const { raw, trans } = await staticFiles({ root });

  const iterator = trans.keys();

  for (let i = 0; i < trans.size; i++) {
    const file = iterator.next().value;
    const source = await Deno.readTextFile(file);
    const js = await transform({
      source,
      importmap: importMap,
      root: base,
    });

    const directory = file.split("/");
    let name = directory.pop();
    name = name.replace(".jsx", ".js").replace(".tsx", ".js");
    await ensureDir(`./.ultra/${directory.join("/")}`);
    await Deno.writeTextFile(`./.ultra/${directory.join("/")}/${name}`, js);
  }

  // graph
  const ultraGraph = await graph({ importMap });
  await Deno.writeTextFile(`./.ultra/graph.json`, JSON.stringify(ultraGraph));

  // deps
  let d = await fetch(
    "http://127.0.0.1:8080/src/deps.js",
  );
  d = await d.text();
  await Deno.writeTextFile(`./.ultra/deps.js`, d);

  // static
  let c = await fetch(
    "http://127.0.0.1:8080/src/static.js",
  );
  c = await c.text();
  c = await transform({
    source: c,
    importmap: importMap,
    root: base,
  });
  await Deno.writeTextFile(`./.ultra/static.js`, c);

  // render
  let render = await fetch(
    "http://127.0.0.1:8080/src/render.ts",
  );
  render = await render.text();
  render = await transform({
    source: render,
    importmap: importMap,
    root: base,
  });
  await Deno.writeTextFile(`./.ultra/render.js`, render);

  // ultra
  let ultra = await fetch(
    "http://127.0.0.1:8080/src/deno/server.js",
  );
  ultra = await ultra.text();
  ultra = await transform({
    source: ultra,
    importmap: importMap,
    root: base,
  });
  await ensureDir("./.ultra/deno/");
  await Deno.writeTextFile(`./.ultra/deno/server.js`, ultra);
};

export default build;
