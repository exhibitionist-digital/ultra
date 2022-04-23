// @ts-nocheck todo: add types
import { replaceFileExt } from "./resolver.ts";
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
      attributes.push(`<${replaceFileExt(url, ".js")}>; rel="modulepreload"`);
    }
  }

  if (attributes.length > 0) {
    const linkHeaders = attributes.join(", ");
    cache[url] = linkHeaders;

    return linkHeaders;
  }
};

const preloadedImports = [
  "react",
  "react-dom",
  "react-helmet",
  "wouter",
  "swr",
  "ultra/cache",
  // TODO: Allow users to add to this list,
];

export const ultraloader = async ({ importMap }) => {
  const link = await preloader(
    preloadedImports.map((name) => {
      return importMap.imports[name];
    }),
    (specifier) => {
      if (extname(specifier) === ".js") {
        return specifier;
      }
    },
  );

  return link;
};

export default preloader;
