// @ts-nocheck todo: add types

import { createCache, createGraph, extname } from "./deps.ts";

const cache = createCache();
const { cacheInfo, load } = cache;

const modulepreloadArgs = async (assets) => {
  const graph = await createGraph(assets, {
    cacheInfo,
    load,
  });

  const links = [];
  const { modules } = graph.toJSON();

  for (const { specifier } of modules) {
    if (extname(specifier) === ".js") {
      links.push(specifier);
    }
  }

  const args = links.map((value) => {
    return `<${value}>; rel="modulepreload"`;
  });

  return args.join(", ");
};

export default modulepreloadArgs;
