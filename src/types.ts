export type ImportMap = { imports: Record<string, string> };

export type Navigate = (to: string, opts?: { replace?: boolean }) => void;

export type Config = {
  importMap?: string;
};

export type Context = {
  request: Request;
  response: {
    body?: BodyInit;
    headers?: Record<string, string>;
    status?: number;
    statusText?: string;
  };
};

export type TransformOptions = {
  source: string;
  sourceUrl: URL;
  importMap: ImportMap;
  minify?: boolean;
  relativePrefix?: string;
};

export type Ultraloader = {
  importMap: ImportMap;
};

export type RenderOptions = {
  importMap: ImportMap;
  url: URL;
  lang: string;
  disableStreaming?: boolean;
};

export type Cache = Map<unknown, unknown>;

export type Assets = {
  raw: Map<string, string>;
  transpile: Map<string, string>;
};

export type MiddlewareNextFunction = (shortCircuit?: boolean) => Promise<void>;

export type Middleware<C extends Context = Context> = (
  context: C,
  next: MiddlewareNextFunction,
) => Promise<void>;
