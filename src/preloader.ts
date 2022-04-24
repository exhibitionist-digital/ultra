// @ts-nocheck todo: add types

import { createGraph, extname } from "./deps.dev.ts";

const preloader = async (path, map, cache) => {
  const { cacheInfo, load } = cache;

  const graph = await createGraph(path, {
    cacheInfo,
    load,
  });

  const { modules } = graph.toJSON();
  const attributes = [];

  for (const { specifier } of modules) {
    let path = map(specifier);
    if (path) {
      // esm.sh fix for deno
      path = path.replace("/deno/", "/es2021/");
      attributes.push(`<${path}>; rel="modulepreload"`);
    }
  }

  return attributes.join(", ");
};

export const ultraloader = async ({ importMap, cache }) => {
  const link = await preloader([
    importMap.imports["react"],
    importMap.imports["react-dom"],
    importMap.imports["wouter"],
    importMap.imports["swr"],
    importMap.imports["react-helmet"],
    importMap.imports["ultra/cache"],
  ], (specifier) => {
    if (extname(specifier) === ".js") {
      return specifier;
    }
  }, cache);
  return link;
};

export default preloader;
