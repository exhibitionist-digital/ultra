import type { BuildPlugin } from "../types.ts";

export const netlify: BuildPlugin = {
  name: "netlify-edge",
  onBuild(_builder, _result) {
    throw new Error("TODO");
  },
};
