import { TransformOptions as EsBuildTransformOptions } from "https://deno.land/x/esbuild@v0.12.24/mod.js";

export type ImportMap = { imports: Record<string, unknown> };

export type Navigate = (to: string, opts?: { replace?: boolean }) => void;

export type StartOptions = {
  importMap: ImportMap;
  lang?: string;
  root?: string;
  dir?: string;
  env?: Record<string, unknown>;
};

type Context = {
  request: Request;
  response: {
    body: string | ReadableStream<Uint8Array>;
    type: string;
  };
};

export type OakOptions = {
  importMap: ImportMap;
  lang?: string;
  root?: string;
  dir?: string;
  env?: Record<string, unknown>;
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
  streaming?: boolean;
  cacheBuster?: number;
};

export type Cache = Map<unknown, unknown>;

export type VercelStart = {
  request: Request;
};

export type APIHandler = (request: Request) => Response;
