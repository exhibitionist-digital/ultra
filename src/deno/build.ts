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
const importMapPath = Deno.env.get("importMap") || "./importMap.json";
const importMap = JSON.parse(await Deno.readTextFile(importMapPath));

const build = async () => {
  const { transpile } = await assets(dir);

  const iterator = transpile.keys();

  for (let i = 0; i < transpile.size; i++) {
    const file = iterator.next().value;
    const source = await Deno.readTextFile(file);
    const js = await transform({
      source,
      importMap,
      root,
    });

    const directory = file.split("/");
    let name = directory.pop();
    name = name.replace(".jsx", ".js").replace(".tsx", ".js");
    await ensureDir(`./.ultra/${directory.join("/")}`);
    await Deno.writeTextFile(`./.ultra/${directory.join("/")}/${name}`, js);
  }

  // importMap
  Object.keys(importMap.imports)?.forEach((k) => {
    // @ts-ignore any
    const im: string = importMap.imports[k];
    if (im.indexOf("http") < 0) {
      // @ts-ignore any
      importMap.imports[k] = jsify(im);
    }
  });
  await Deno.writeTextFile(
    `./.ultra/importMap.json`,
    JSON.stringify(importMap),
  );

  // graph
  const cache = createCache();
  const ultraGraph = await ultraloader({ importMap, cache });
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
    importMap,
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
    importMap,
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
    importMap,
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
    importMap,
    root,
  });
  await ensureDir("./.ultra/deno/");
  await Deno.writeTextFile(`./.ultra/deno/server.js`, ultraTrans);

  // server
  const server = `import ultra from "./deno/server.js";
  const importMap = await Deno.readTextFile("./importMap.json")
  
  await ultra({
    importMap: JSON.parse(importMap),
    root: "${root}",
    lang: "${lang}"
  });`;

  await Deno.writeTextFile(`./.ultra/ULTRA.js`, server);

  console.log("Ultra build complete");
  Deno.exit();
};

export default build;

await build();
