import { cssomSheet, setup, tw } from "twind";

const serverSheet = (target = new Set<string>()) => {
  return {
    target,
    insert: (rule: string) => {
      target.add(rule);
    },
  };
};

// Create a "CSSStyleSheet" on the client and a "ServerSheet" when server side
export const sheet = typeof Deno === "undefined" ? cssomSheet() : serverSheet();

setup({
  sheet,
  preflight: true,
  theme: {},
  plugins: {},
});

export { tw };
