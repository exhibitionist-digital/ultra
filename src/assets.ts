// @ts-nocheck todo: add types

import { mime, walk } from "./deps.ts";

const assets = async ({ root }) => {
  const meta = {
    raw: new Map(),
    transpile: new Map(),
  };

  for await (const file of walk(`./${root}`)) {
    if (file.isFile) {
      const contentType = mime.lookup(file.path.split(".").pop());
      if (contentType) {
        const transpile = contentType == "text/jsx" ||
          contentType == "text/tsx";
        const isScript = transpile ||
          contentType === "application/javascript";

        meta[transpile ? "transpile" : "raw"].set(
          file.path,
          isScript ? "application/javascript" : contentType,
        );
      }
    }
  }

  return meta;
};

export default assets;
