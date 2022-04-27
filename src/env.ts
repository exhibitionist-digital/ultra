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

export function resolveEnv() {
  const denoEnv = Deno.env.toObject();

  const mode = denoEnv.ULTRA_MODE || denoEnv.mode || null;
  const port = Number(denoEnv.PORT || denoEnv.port) || 8000;
  const sourceDirectory = denoEnv.ULTRA_SRC || denoEnv.source;
  const vendorDirectory = denoEnv.ULTRA_VENDOR || denoEnv.vendor;
  const apiDirectory = denoEnv.ULTRA_API_SRC || denoEnv.api;

  const origin = denoEnv.ULTRA_ORIGIN || denoEnv.root ||
    `http://localhost:${port}`;

  const lang = denoEnv.ULTRA_LOCALE || denoEnv.lang;
  const disableStreaming = denoEnv.disableStreaming;

  const env = {
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
  return create(env, envSchema);
}

const env = resolveEnv();

export const isDev = env.mode === "dev";
export const origin = env.origin;
export const root = env.root;
export const lang = env.lang;
export const port = env.port;
export const mode = env.mode;
export const sourceDirectory = env.sourceDirectory;
export const vendorDirectory = env.vendorDirectory;
export const apiDirectory = env.apiDirectory;
export const disableStreaming = env.disableStreaming;
