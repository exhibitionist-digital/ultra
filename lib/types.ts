export type { Context, Env } from "https://deno.land/x/hono@v3.2.7/mod.ts";
export type { Next } from "https://deno.land/x/hono@v3.2.7/types.ts";
export type { StatusCode } from "https://deno.land/x/hono@v3.2.7/utils/http-status.ts";

export type Mode = "development" | "production";

export type CreateServerOptions = {
  mode?: Mode;
  /**
   * The path to your ImportMap. Ultra will inject this into the head
   * of your rendered HTML markup.
   */
  importMapPath?: string;
  enableEsModuleShims?: boolean;
  esModuleShimsPath?: string;
  /**
   * The browser entrypoint. This is what initially gets sent with the server
   * rendered HTML markup. This should be what hydrates your React application.
   */
  browserEntrypoint?: string;
  compilerOptions?: CompilerOptions;
};

export type ImportMap = {
  imports: Record<string, string>;
  scopes?: Record<string, Record<string, string>>;
};

export type RenderedReadableStream = ReadableStream<Uint8Array> & {
  allReady?: Promise<void> | undefined;
};

export type CompilerHooks = {
  beforeTransform?: (
    source: string,
    file: { path: string; extension: string },
  ) => string;
  afterTransform?: (
    source: string,
    file: { path: string; extension: string },
  ) => string;
};

export type CompilerOptions = {
  root: string;
  hooks?: CompilerHooks;
} & Omit<TransformSourceOptions, "minify" | "development">;

export type TransformSourceOptions = {
  jsxImportSource?: string;
  development?: boolean;
  sourceMaps?: boolean;
  minify?: boolean;
};
