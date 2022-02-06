// @ts-nocheck todo: add types

import { mime, walk } from "./deps.ts";

const staticFiles = async ({ root }) => {
  const raw = new Map();
  const trans = new Map();
  for await (const file of walk(`./${root}`)) {
    if (file.isFile) {
      const type = mime.lookup(file.path.split(".").pop());
      if (type) {
        if (type == "text/jsx" || type == "text/tsx") {
          trans.set(file.path, type);
        } else {
          raw.set(file.path, type);
        }
      }
    }
  }
  return { raw, trans };
};

export default staticFiles;
