export type ImportMap = { imports: Record<string, unknown> };

export type Navigate = (to: string, opts?: { replace?: boolean }) => void;

export type StartOptions = {
  importmap: string;
  lang?: string;
};

export type TransformOptions = {
  source: string;
  importmap: ImportMap;
  root: string;
};

export type RenderOptions = {
  root: string;
  importmap: ImportMap;
  request: { url: URL };
  lang: string;

  // Number of bytes of the response to buffer before starting to stream. This
  // allows 500 statuses to be raised, provided the error happens while the
  // response is buffering, rather than streaming:
  bufferSize?: number;

  // Size of the chunk to emit to the connection as the response streams:
  chunkSize?: number;
};

export type Cache = Map<unknown, unknown>;
