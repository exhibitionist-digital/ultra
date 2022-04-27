import { resolveEnv } from "./resolveEnv.ts";

const env = resolveEnv(Deno.env.toObject());

export const isDev = env.mode === "dev";
export const origin = env.origin;
export const lang = env.lang;
export const port = env.port;
export const mode = env.mode;
export const sourceDirectory = env.sourceDirectory;
export const vendorDirectory = env.vendorDirectory;
export const apiDirectory = env.apiDirectory;
export const disableStreaming = env.disableStreaming;
