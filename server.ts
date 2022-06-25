import { RenderState } from "./src/types.ts";

export { default } from "./src/server.ts";
export type { RenderState } from "./src/types.ts";

declare global {
  interface Window {
    __ultra_renderState: RenderState;
  }
}
