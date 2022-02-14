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

  // Number of bytes of the response to buffer before starting to stream. This
  // allows 500 statuses to be raised, provided the error happens while the
  // response is buffering, rather than streaming:
  bufferSize?: number;

  // Size of the chunk to emit to the connection as the response streams:
  chunkSize?: number;
  cacheBuster?: number;
};

export type Cache = Map<unknown, unknown>;

export type VercelStart = {
  request: Request;
};
