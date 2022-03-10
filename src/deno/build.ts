import { createCache } from "../deps.ts";
import assets from "./../assets.ts";
import transform from "./../transform.ts";
import { ultraloader } from "./../preloader.ts";
import { jsify } from "../resolver.ts";
import { emptyDir, ensureDir } from "https://deno.land/std/fs/mod.ts";

await emptyDir("./.ultra");

const root = Deno.env.get("root") || "http://localhost:8000";
const dir = Deno.env.get("dir") || "src";
const lang = Deno.env.get("lang") || "en";
const importmapPath = Deno.env.get("importmap") || "./importmap.json";
const importmap = JSON.parse(await Deno.readTextFile(importmapPath));

const build = async () => {
  const { transpile } = await assets(dir);

  const iterator = transpile.keys();

  for (let i = 0; i < transpile.size; i++) {
    const file = iterator.next().value;
    const source = await Deno.readTextFile(file);
    const js = await transform({
      source,
      importmap,
      root,
    });

    const directory = file.split("/");
    let name = directory.pop();
    name = name.replace(".jsx", ".js").replace(".tsx", ".js");
    await ensureDir(`./.ultra/${directory.join("/")}`);
    await Deno.writeTextFile(`./.ultra/${directory.join("/")}/${name}`, js);
  }

  // importmap
  Object.keys(importmap.imports)?.forEach((k) => {
    // @ts-ignore any
    const im: string = importmap.imports[k];
    if (im.indexOf("http") < 0) {
      // @ts-ignore any
      importmap.imports[k] = jsify(im);
    }
  });
  await Deno.writeTextFile(
    `./.ultra/importmap.json`,
    JSON.stringify(importmap),
  );

  // graph
  const cache = createCache();
  const ultraGraph = await ultraloader({ importmap, cache });
  await Deno.writeTextFile(`./.ultra/graph.json`, JSON.stringify(ultraGraph));

  // deps
  const depReq = await fetch(
    "https://deno.land/x/ultra/src/deno/deps.ts",
  );
  const depText = await depReq.text();
  await Deno.writeTextFile(`./.ultra/deps.js`, depText);

  // assets
  const assetReq = await fetch(
    "https://deno.land/x/ultra/src/assets.ts",
  );
  const assetText = await assetReq.text();
  const assetTrans = await transform({
    source: assetText,
    importmap,
    root,
  });
  await Deno.writeTextFile(`./.ultra/assets.js`, assetTrans);

  // render
  const renderReq = await fetch(
    "https://deno.land/x/ultra/src/render.ts",
  );
  const renderText = await renderReq.text();
  const renderTrans = await transform({
    source: renderText,
    importmap,
    root,
  });
  await Deno.writeTextFile(`./.ultra/render.js`, renderTrans);

  // env
  const envReq = await fetch(
    "https://deno.land/x/ultra/src/env.ts",
  );
  const envText = await envReq.text();
  const envTrans = await transform({
    source: envText,
    importmap,
    root,
  });
  await Deno.writeTextFile(`./.ultra/env.js`, envTrans);

  // ultra
  const ultraReq = await fetch(
    "https://deno.land/x/ultra/src/deno/server.ts",
  );
  const ultraText = await ultraReq.text();
  const ultraTrans = await transform({
    source: ultraText,
    importmap,
    root,
  });
  await ensureDir("./.ultra/deno/");
  await Deno.writeTextFile(`./.ultra/deno/server.js`, ultraTrans);

  // server
  const server = `import ultra from "./deno/server.js";
  const importmap = await Deno.readTextFile("./importmap.json")
  
  await ultra({
    importmap: JSON.parse(importmap),
    root: "${root}",
    lang: "${lang}"
  });`;

  await Deno.writeTextFile(`./.ultra/ULTRA.js`, server);

  console.log("Ultra build complete");
  Deno.exit();
};

export default build;

await build();
