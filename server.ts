import { State } from "./src/deps.ts";

export { default } from "./src/server.ts";
export type { State } from "./src/deps.ts";

declare global {
  interface Window {
    __ultra_state: State;
  }
}
