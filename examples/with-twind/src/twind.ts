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
import config from "./twind.config.js";

const styleElementId = "__twind";

export const sheet = typeof Deno === "undefined"
  ? cssom(`style#${styleElementId}`)
  : virtual();

export const stringify = (target: unknown) =>
  `<style id="${styleElementId}">${stringify$(target)}</style>`;

//@ts-ignore twind type issue
export const tw = twind(
  config,
  sheet,
);

export const tx = tx$.bind(tw);
export const injectGlobal = injectGlobal$.bind(tw);
export const keyframes = keyframes$.bind(tw);
