// @ts-nocheck todo: add types

import { mime, walk } from "./deps.ts";

const assets = async ({ root }) => {
  const assetsMeta = new Map();
  for await (const file of walk(`./${root}`)) {
    if (file.isFile) {
      const type = mime.lookup(file.path.split(".").pop());
      if (type) {
        const needsTranspilation = type == "text/jsx" || type == "text/tsx";
        const isScript = needsTranspilation ||
          type === "application/javascript";

        assetsMeta.set(file.path, {
          transpile: needsTranspilation,
          "content-type": isScript ? "application/javascript" : type,
          isScript,
        });
      }
    }
  }
  return assetsMeta;
};

export default assets;
