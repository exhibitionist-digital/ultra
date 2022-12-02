import type { Config } from "../common/config.ts";

export function twindContent(config: Config) {
  return `
  // @see https://twind.style/library-mode
  import {
    cssom,
    injectGlobal as injectGlobal$,
    keyframes as keyframes$,
    stringify as stringify$,
    twind,
    tx as tx$,
    virtual,
  } from "@twind/core";
  import config from "./twind.config${config.ts ? ".ts" : ".js"}";

  export const sheet = typeof Deno === "undefined"
    ? cssom('style#__twind')
    : virtual();

  export const stringify = (target: unknown) =>
    \`<style id="__twind">\${stringify$(target)}</style>\`;

  //@ts-ignore twind type issue
  export const tw = twind(
    config,
    sheet,
  );

  export const tx = tx$.bind(tw);
  export const injectGlobal = injectGlobal$.bind(tw);
  export const keyframes = keyframes$.bind(tw);
`;
}

export function twindConfigContent(_config: Config) {
  return `
  import { defineConfig } from "@twind/core";
  import presetAutoprefix from "@twind/preset-autoprefix";
  import presetTailwind from "@twind/preset-tailwind";

  export default defineConfig({
    theme: {
    // add theme styles here
    },
    presets: [presetAutoprefix(), presetTailwind()],
  });
  `;
}
