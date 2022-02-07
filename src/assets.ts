// @ts-nocheck todo: add types

import { mime, walk } from "./deps.ts";
import modulepreloadArgs from "./modulepreload.ts";

const assets = async ({ root }) => {
  const assetsMeta = new Map();
  for await (const file of walk(`./${root}`)) {
    if (file.isFile) {
      const type = mime.lookup(file.path.split(".").pop());
      if (type) {
        const absPath = `file://${Deno.cwd()}/${file.path}`;
        const headers = { type };

        const needsTranspilation = type == "text/jsx" || type == "text/tsx";
        const isScript = needsTranspilation ||
          type === "application/javascript";

        if (isScript) {
          headers.link = await modulepreloadArgs(absPath);
        }

        assetsMeta.set(file.path, {
          transpile: needsTranspilation,
          headers,
        });
      }
    }
  }
  return assetsMeta;
};

export default assets;
