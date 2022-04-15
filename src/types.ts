export type ImportMap = { imports: Record<string, string> };

export type Navigate = (to: string, opts?: { replace?: boolean }) => void;

export type Config = {
  importMap?: string;
};

type Context = {
  request: Request;
  response: {
    body: string | ReadableStream<Uint8Array>;
    type: string;
  };
};

export type OakOptions = {
  env?: Record<string, string>;
  context: Context;
};

export type TransformOptions = {
  source: string;
  sourceUrl: URL;
  importMap: ImportMap;
  cacheBuster?: number;
  env?: Record<string, unknown>;
  minify?: boolean;
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

export type APIHandler = (request: Request) => Response | Promise<Response>;
