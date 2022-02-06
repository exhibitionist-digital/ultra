// @ts-nocheck todo: add types

import { createCache, createGraph, extname } from "./deps.ts";

const cache = createCache();
const { cacheInfo, load } = cache;

const graph = async ({ importMap }) => {
  const packages = [];
  const links = new Set();

  packages.push(importMap.imports["react"]);
  packages.push(importMap.imports["react-dom"]);
  packages.push(importMap.imports["wouter"]);
  packages.push(importMap.imports["swr"]);
  packages.push(importMap.imports["react-helmet"]);
  packages.push(importMap.imports["ultra/cache"]);

  const graph = await createGraph(packages, {
    cacheInfo,
    load,
  });

  const { modules } = graph.toJSON();
  for (const { specifier } of modules) {
    if (extname(specifier) === ".js") {
      links.add(specifier);
    }
  }

  const headers = [];
  for (const value of links) {
    headers.push(`<${value}>; rel="modulepreload"`);
  }

  return headers;
};

export default graph;
