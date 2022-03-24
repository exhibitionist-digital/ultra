import { TransformOptions as EsBuildTransformOptions } from "https://deno.land/x/esbuild@v0.12.24/mod.js";

export type Importmap = { imports: Record<string, unknown> };

export type Navigate = (to: string, opts?: { replace?: boolean }) => void;

export type StartOptions = {
  importmap: Importmap;
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
  importmap: Importmap;
  lang?: string;
  root?: string;
  dir?: string;
  env?: Record<string, unknown>;
  context: Context;
};

export type TransformOptions = {
  source: string;
  importmap: Importmap;
  root: string;
  loader?: EsBuildTransformOptions["loader"];
  cacheBuster?: number;
  env?: Record<string, unknown>;
};

export type Ultraloader = {
  importmap: Importmap;
};

export type RenderOptions = {
  root: string;
  importmap: Importmap;
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
