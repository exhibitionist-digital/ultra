import {
  boolean,
  create,
  defaulted,
  Infer,
  nullable,
  number,
  object,
  string,
} from "https://esm.sh/superstruct@0.15.4";

const envSchema = object({
  origin: string(),
  root: string(),
  lang: defaulted(string(), "en"),
  port: defaulted(number(), 8000),
  mode: nullable(string()),
  sourceDirectory: defaulted(string(), "src"),
  vendorDirectory: defaulted(string(), "x"),
  apiDirectory: defaulted(string(), "src/api"),
  disableStreaming: defaulted(boolean(), false),
});

export type UltraEnvironment = Infer<typeof envSchema>;

export function resolveEnv(env?: { [index: string]: string }) {
  const mode = env?.ULTRA_MODE || env?.mode || null;
  const port = Number(env?.PORT || env?.port) || undefined;
  const sourceDirectory = env?.ULTRA_SRC || env?.source;
  const vendorDirectory = env?.ULTRA_VENDOR || env?.vendor;
  const apiDirectory = env?.ULTRA_API_SRC || env?.api;

  const origin = env?.ULTRA_ORIGIN || env?.root ||
    `http://localhost:${port}`;

  const lang = env?.ULTRA_LOCALE || env?.lang;
  const disableStreaming = env?.disableStreaming;

  const data = {
    origin,
    root: origin,
    port,
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
