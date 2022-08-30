import type { BuildPlugin } from "../types.ts";

export const vercel: BuildPlugin = {
  name: "vercel",
  onBuild(_builder, _result) {
    throw new Error("TODO");
  },
};
