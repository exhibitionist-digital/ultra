import { resolveEnv } from "./resolveEnv.ts";

const env = resolveEnv(Deno.env.toObject());

/**
 * A boolean indicating if Ultra is running in "dev" mode.
 */
export const isDev = env.mode === "dev";
/**
 * The origin the server is listening on.
 * @default "http://localhost:{port}"
 */
export const origin = env.origin;
/**
 * @deprecated use origin instead
 */
export const root = env.origin;
/**
 * The default lang/locale.
 * @default "en"
 */
export const lang = env.lang;
/**
 * The port the server will be listening on.
 * @default 8000
 */
export const port = env.port;
/**
 * The port the development websocket server will listen on.
 * @default 8001
 */
export const devServerWebsocketPort = env.devServerWebsocketPort;
/**
 * The runtime mode of Ultra.
 * @default null
 */
export const mode = env.mode;
/**
 * The path to the project source directory.
 * @default "src"
 */
export const sourceDirectory = env.sourceDirectory;
/**
 * The path to the vendored output directory.
 * @default "x"
 */
export const vendorDirectory = env.vendorDirectory;
/**
 * The path to the api source directory.
 * @default "src/api"
 */
export const apiDirectory = env.apiDirectory;
/**
 * A boolean indicating if streaming is disabled globally.
 * @default false
 */
export const disableStreaming = env.disableStreaming;
