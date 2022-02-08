// @ts-nocheck todo: add types

import { createGraph } from "./deps.ts";

const generateLinkHeader = async (path, map) => {
  const graph = await createGraph(path);

  const { modules } = graph.toJSON();
  const attributes = [];

  for (const { specifier } of modules) {
    const path = map(specifier);
    if (path) {
      attributes.push(`<${path}>; rel="modulepreload"`);
    }
  }

  return attributes.join(", ");
};

export default generateLinkHeader;
