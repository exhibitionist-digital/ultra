import type { Context as HonoContext } from "https://deno.land/x/hono@v2.5.1/mod.ts";
import type { Environment } from "https://deno.land/x/hono@v2.5.1/types.ts";
export type { Next } from "https://deno.land/x/hono@v2.5.1/types.ts";
import type { JscTarget } from "https://esm.sh/@swc/core@1.3.11/types.d.ts";
export type { StatusCode } from "https://deno.land/x/hono@v2.5.1/utils/http-status.ts";

export type Mode = "development" | "production";

export type Context<
  RequestParamKeyType extends string = string,
  E extends Partial<Environment> = Environment,
> = HonoContext<RequestParamKeyType, E>;

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
  filename?: string;
  target?: JscTarget;
  useBuiltins?: boolean;
  externalHelpers?: boolean;
  dynamicImport?: boolean;
  jsxImportSource?: string;
  runtime?: "automatic" | "classic" | undefined;
  development?: boolean;
  sourceMaps?: boolean;
  minify?: boolean;
  refresh?: boolean;
};
