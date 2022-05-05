import assets from "./assets.ts";
import render from "./render.ts";
import { Middleware } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { LRU, readableStreamFromReader } from "./deps.ts";
import {
  disableStreaming,
  lang,
  sourceDirectory,
  vendorDirectory,
} from "./env.ts";
import { replaceFileExt, ValidExtensions } from "./resolver.ts";
import { resolveConfig, resolveImportMap } from "./config.ts";
import transpile from "./transpile.ts";

const memory = new LRU<string>(500);
const [
  rawAssets,
  vendorAssets,
  importMap,
] = await Promise.all([
  assets(sourceDirectory),
  assets(`.ultra/${vendorDirectory}`),
  (async () => {
    const cwd = Deno.cwd();
    const config = await resolveConfig(cwd);
    const importMap = await resolveImportMap(cwd, config);
    return importMap;
  })(),
]);

export const requestHandler: Middleware = async ({ request, response }) => {
  // vendorMap
  if (vendorAssets.raw.has(`.ultra${request.url.pathname}`)) {
    response.status = 200;
    response.type = "application/javascript";
    response.body = readableStreamFromReader(
      await Deno.open(`./.ultra${request.url.pathname}`),
    );
    return;
  }

  // staticAsset
  const filePath = `${sourceDirectory}${request.url.pathname}`;
  if (rawAssets.raw.has(filePath)) {
    const contentType = rawAssets.raw.get(filePath);
    if (!contentType) {
      response.status = 415;
      response.type = "text/plain";
      return;
    }

    response.status = 200;
    response.type = contentType;
    response.body = readableStreamFromReader(await Deno.open(`./${filePath}`));
    return;
  }

  // transpileSource
  const fileTypes: ValidExtensions[] = [".jsx", ".tsx", ".ts"];
  for (const fileType of fileTypes) {
    const filePath = `${sourceDirectory}${
      replaceFileExt(request.url.pathname, fileType)
    }`;
    if (rawAssets.transpile.has(filePath)) {
      response.status = 200;
      response.type = "application/javascript";
      response.body = await transpile(filePath, request.url, memory, importMap);
      return;
    }
  }

  // renderPage
  response.status = 200;
  response.type = "text/html; charset=utf-8";
  response.body = await render({
    url: request.url,
    importMap,
    lang,
    disableStreaming,
  });
};
