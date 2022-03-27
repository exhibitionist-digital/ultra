import assets from "./../assets.ts";
import transform from "./../transform.ts";
import { jsify } from "../resolver.ts";
import { emptyDir, ensureDir } from "./deps.ts";
// import vendor from "../vendor.ts";

const ultra = "http://172.20.10.6:8080";

await ensureDir("./.ultra");
await emptyDir("./.ultra");

const sourceDirectory = Deno.env.get("source") || "src";
const configPath = Deno.env.get("config") || "deno.json";
const root = Deno.env.get("root") || "http://localhost:8000";
// const lang = Deno.env.get("lang") || "en";

const config = JSON.parse(Deno.readTextFileSync(configPath));

const importMap = JSON.parse(Deno.readTextFileSync(config?.importMap));

const build = async () => {
  Object.keys(importMap.imports)?.forEach((k) => {
    // @ts-ignore any
    const im: string = importMap.imports[k];
    if (im.indexOf("http") < 0) {
      // @ts-ignore any
      importMap.imports[k] = jsify(im);
    }
  });
  const { raw, transpile } = await assets(sourceDirectory);

  const rawIterator = raw.keys();

  for (let i = 0; i < raw.size; i++) {
    const file = rawIterator.next().value;
    const source = await Deno.readTextFile(file);

    console.log({ file, source });
    const directory = file.split("/");
    const name = directory.pop();
    await ensureDir(`./.ultra/${directory.join("/")}`);
    await Deno.writeTextFile(`./.ultra/${directory.join("/")}/${name}`, source);
  }

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
    name = name.replace(".jsx", ".js").replace(".tsx", ".js").replace(
      ".ts",
      ".js",
    );
    await ensureDir(`./.ultra/${directory.join("/")}`);
    await Deno.writeTextFile(`./.ultra/${directory.join("/")}/${name}`, js);
  }

  await Deno.writeTextFile(
    `./.ultra/importMap.json`,
    JSON.stringify(importMap),
  );

  // graph
  // const cache = createCache();
  // const ultraGraph = await ultraloader({ importMap, cache });
  // await Deno.writeTextFile(`./.ultra/graph.json`, JSON.stringify(ultraGraph));

  // deps
  const depReq = await fetch(
    `${ultra}/src/deno/deps.ts`,
  );
  const depText = await depReq.text();
  await Deno.writeTextFile(`./.ultra/deps.js`, depText);

  // assets
  const assetReq = await fetch(
    `${ultra}/src/assets.ts`,
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
    `${ultra}/src/render.ts`,
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
    `${ultra}/src/env.ts`,
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
    `${ultra}/src/deno/server.ts`,
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
  
  await ultra();`;

  await Deno.writeTextFile(`./.ultra/ULTRA.js`, server);

  console.log("Ultra build complete");
  Deno.exit();
};

export default build;

await build();
