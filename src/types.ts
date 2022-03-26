import { TransformOptions as EsBuildTransformOptions } from "https://deno.land/x/esbuild@v0.12.24/mod.js";

export type ImportMap = { imports: Record<string, string> };

export type Navigate = (to: string, opts?: { replace?: boolean }) => void;

type Context = {
  request: Request;
  response: {
    body: string | ReadableStream<Uint8Array>;
    type: string;
  };
};

export type StartOptions = {
  disableStreaming?: boolean;
  env?: Record<string, string>;
};

export type OakOptions = {
  env?: Record<string, string>;
  context: Context;
};

export type TransformOptions = {
  source: string;
  importMap: ImportMap;
  root: string;
  loader?: EsBuildTransformOptions["loader"];
  cacheBuster?: number;
  env?: Record<string, unknown>;
};

export type Ultraloader = {
  importMap: ImportMap;
};

export type RenderOptions = {
  root: string;
  importMap: ImportMap;
  url: URL;
  lang: string;
  disableStreaming?: boolean;
};

export type Cache = Map<unknown, unknown>;

export type APIHandler = (request: Request) => Response;
