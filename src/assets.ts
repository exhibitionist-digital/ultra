// @ts-nocheck todo: add types

import { mime, walk } from "./deps.ts";
import modulepreloadArgs from "./modulepreload.ts";

const assets = async ({ root }) => {
  const raw = new Map();
  const trans = new Map();
  for await (const file of walk(`./${root}`)) {
    if (file.isFile) {
      const type = mime.lookup(file.path.split(".").pop());
      if (type) {
        const absPath = `file://${Deno.cwd()}/${file.path}`;
        const meta = { headers: { type } };

        const needsTranspilation = type == "text/jsx" || type == "text/tsx";
        const isScript = needsTranspilation ||
          type === "application/javascript";

        if (isScript) {
          meta.headers.link = await modulepreloadArgs(absPath);
        }

        (needsTranspilation ? trans : raw).set(
          file.path,
          meta,
        );
      }
    }
  }
  return { raw, trans };
};

export default assets;
