import {
  boolean,
  coerce,
  create,
  defaulted,
  Infer,
  nullable,
  number,
  object,
  string,
} from "https://esm.sh/superstruct@0.15.4";
import type { Struct } from "https://esm.sh/superstruct@0.15.4";

function portFromString(defaultValue: number): Struct<number, null> {
  return defaulted(
    coerce(
      number(),
      string(),
      (value) => Number(value),
    ),
    defaultValue,
  );
}

const defaultPort = 8000;
const defaultDevServerWebsocketPort = 8001;

const envSchema = object({
  origin: string(),
  lang: defaulted(string(), "en"),
  port: portFromString(defaultPort),
  devServerWebsocketPort: portFromString(defaultDevServerWebsocketPort),
  mode: nullable(string()),
  sourceDirectory: defaulted(string(), "src"),
  vendorDirectory: defaulted(string(), "x"),
  apiDirectory: defaulted(string(), "src/api"),
  disableStreaming: defaulted(boolean(), false),
});

export type UltraEnvironment = Infer<typeof envSchema>;

export function resolveEnv(
  env?: { [index: string]: string },
): UltraEnvironment {
  const mode = env?.ULTRA_MODE || env?.mode || null;
  const port = create(env?.PORT || env?.port, portFromString(defaultPort));
  const devServerWebsocketPort = create(
    env?.ULTRA_DEV_SERVER_WEBSOCKET_PORT || env?.devServerWebsocketPort,
    portFromString(defaultDevServerWebsocketPort),
  );
  const sourceDirectory = env?.ULTRA_SRC || env?.source;
  const vendorDirectory = env?.ULTRA_VENDOR || env?.vendor;
  const apiDirectory = env?.ULTRA_API_SRC || env?.api;

  const origin = env?.ULTRA_ORIGIN ||
    `http://localhost:${port}`;

  const lang = env?.ULTRA_LOCALE || env?.lang;
  const disableStreaming = env?.disableStreaming;

  const data = {
    origin,
    port,
    devServerWebsocketPort,
    mode,
    sourceDirectory,
    vendorDirectory,
    apiDirectory,
    lang,
    disableStreaming,
  };

  /**
   * Assert that the environment is valid and return the coerced/resolved value
   */
  return create(data, envSchema);
}
