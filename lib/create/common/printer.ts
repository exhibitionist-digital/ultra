import { Config, Libraries } from "./config.ts";

function print(config: Config, value: Libraries) {
  return function (js: string, ts?: string) {
    if (config.includes.includes(value)) {
      if (config.ts && ts) {
        return ts;
      } else {
        return js;
      }
    } else {
      return "";
    }
  };
}

export function printer(config: Config) {
  return {
    twind: print(config, "twind"),
    stitches: print(config, "stitches"),
    reactHelmetAsync: print(config, "react-helmet-async"),
    reactQuery: print(config, "react-query"),
    reactRouter: print(config, "react-router"),
    wouter: print(config, "wouter"),
    trpc: print(config, "trpc"),
  };
}
