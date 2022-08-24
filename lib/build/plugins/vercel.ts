import type { BuildPlugin } from "../types.ts";

export const vercel: BuildPlugin = {
  name: "vercel",
  onBuild(_result) {
    throw new Error("TODO");
  },
};
