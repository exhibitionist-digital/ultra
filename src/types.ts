import { TransformOptions as EsBuildTransformOptions } from "https://deno.land/x/esbuild@v0.12.24/mod.js";
import { Context } from "https://deno.land/x/oak@v10.4.0/context.ts";

export type Importmap = { imports: Record<string, unknown> };

export type Navigate = (to: string, opts?: { replace?: boolean }) => void;

export type StartOptions = {
  importmap: Importmap;
  lang?: string;
  root?: string;
  dir?: string;
  env?: Record<string, unknown>;
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
