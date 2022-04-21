// @ts-nocheck todo: add types

import { createGraph, extname } from "./deps.ts";

const cache = {};

export const preloader = async (url, map) => {
  if (cache[url]) return cache[url];

  const graph = await createGraph(url);

  const { modules } = graph.toJSON();

  const attributes = [];

  for (const { specifier } of modules) {
    let url = map(specifier);
    if (url) {
      // esm.sh fix for deno
      url = url.replace("/deno/", "/es2021/");
      attributes.push(`<${url}>; rel="modulepreload"`);
    }
  }

  if (attributes.length > 0) {
    const linkHeaders = attributes.join(", ");

    cache[url] = linkHeaders;

    return linkHeaders;
  }
};

export const ultraloader = async ({ importMap }) => {
  const link = await preloader([
    importMap.imports["react"],
    importMap.imports["react-dom"],
    importMap.imports["react-helmet"],
    importMap.imports["wouter"],
    importMap.imports["swr"],
    importMap.imports["ultra/cache"],
  ], (specifier) => {
    if (extname(specifier) === ".js") {
      return specifier;
    }
  });

  return link;
};

export default preloader;
