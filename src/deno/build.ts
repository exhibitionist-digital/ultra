import assets from "./../assets.ts";
import transform from "./../transform.ts";
import { jsify } from "../resolver.ts";
import {
  basename,
  copy,
  dirname,
  emptyDir,
  ensureDir,
  extname,
} from "./deps.ts";
import vendor from "../vendor.ts";
import { port } from "../env.ts";

const ultra = "https://deno.land/x/ultra";

const sourceDirectory = Deno.env.get("source") || "src";
const vendorDirectory = Deno.env.get("vendor") || "x";
const apiDirectory = Deno.env.get("api") || "src/api";
const root = Deno.env.get("root") || `http://localhost:${port}`;

await emptyDir("./.ultra");
await ensureDir(`./.ultra/${sourceDirectory}`);
await ensureDir(`./.ultra/${vendorDirectory}`);

const build = async () => {
  const vendorMap = await vendor();
  Object.keys(vendorMap.imports)?.forEach((k) => {
    // @ts-ignore any
    const im: string = vendorMap.imports[k];
    if (im.indexOf("http") < 0) {
      // @ts-ignore any
      vendorMap.imports[k] = jsify(im);
    }
  });
  const { raw, transpile } = await assets(sourceDirectory);

  // copy static files
  const rawIterator = raw.keys();
  for (let i = 0; i < raw.size; i++) {
    const file = rawIterator.next().value;
    await ensureDir(dirname(`./.ultra/${file}`));
    await copy(file, `./.ultra/${file}`);
  }

  const iterator = transpile.keys();

  for (let i = 0; i < transpile.size; i++) {
    const file = iterator.next().value;
    const source = await Deno.readTextFile(file);

    let prefix = "./";
    for (let x = 0; x < file.split("/").length; x++) {
      if (x != 0) prefix = prefix + "../";
    }

    const localMap = { imports: {} };
    Object.keys(vendorMap.imports)?.forEach((k) => {
      // @ts-ignore any
      const im: string = vendorMap.imports[k];
      if (im.indexOf("http") < 0) {
        // @ts-ignore any
        localMap.imports[k] = `${prefix}${im.replace("./.ultra/", "")}`;
      }
    });

    const js = await transform({
      source,
      sourceUrl: new URL(root),
      importMap: localMap,
      relativePrefix: prefix,
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
    JSON.stringify(vendorMap),
  );

  // graph
  // const cache = createCache();
  // const ultraGraph = await ultraloader({ importMap, cache });
  // await Deno.writeTextFile(`./.ultra/graph.json`, JSON.stringify(ultraGraph));

  const denoMap = { imports: {} };
  Object.keys(vendorMap.imports)?.forEach((k) => {
    // @ts-ignore any
    const im: string = vendorMap.imports[k];
    if (im.indexOf("http") < 0) {
      // @ts-ignore any
      denoMap.imports[k] = `./${im.replace("./.ultra/", "")}`;
    }
  });

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
    sourceUrl: new URL(root),
    importMap: denoMap,
    relativePrefix: "./",
  });

  await Deno.writeTextFile(`./.ultra/assets.js`, assetTrans);

  // render
  const renderReq = await fetch(
    `${ultra}/src/render.ts`,
  );
  const renderText = await renderReq.text();

  const renderTrans = await transform({
    source: renderText,
    sourceUrl: new URL(root),
    importMap: denoMap,
    relativePrefix: "./",
  });
  await Deno.writeTextFile(`./.ultra/render.js`, renderTrans);

  // env
  const envReq = await fetch(
    `${ultra}/src/env.ts`,
  );
  const envText = await envReq.text();
  const envTrans = await transform({
    source: envText,
    sourceUrl: new URL(root),
    importMap: denoMap,
    relativePrefix: "./",
  });
  await Deno.writeTextFile(`./.ultra/env.js`, envTrans);

  // API
  const api = await assets(apiDirectory);
  const apiPaths = [
    ...(api?.raw?.keys() || []),
    ...(api?.transpile?.keys() || []),
  ];

  let apiImports = "";
  let apiRoutes = "";
  apiPaths.forEach((path) => {
    const name = basename(path).replace(extname(path), "");
    apiImports += `import ${name}_API from "./../${path}";`;
    apiRoutes +=
      `if (url?.pathname === "/api/${name}") return ${name}_API(request);`;
  });

  apiRoutes +=
    `if (url?.pathname.startsWith("/api/")) return new Response('{"error":"Not Found"}', { headers: {"content-type": "application/json"}, status: ${404} });`;

  // ultra
  const ultraReq = await fetch(
    `${ultra}/src/deno/server.ts`,
  );
  let ultraText = await ultraReq.text();
  ultraText = apiImports + ultraText;
  ultraText = ultraText.replace("//API//", apiRoutes);
  const ultraTrans = await transform({
    source: ultraText,
    sourceUrl: new URL(root),
    importMap: denoMap,
    relativePrefix: "./",
  });
  await ensureDir("./.ultra/deno/");
  await Deno.writeTextFile(`./.ultra/deno/server.js`, ultraTrans);

  // server
  const server = `import ultra from "./deno/server.js";
  await ultra();`;

  await Deno.writeTextFile(`./.ultra/ULTRA.js`, server);

  console.log("Ultra build complete");
  Deno.exit();
};

export default build;
