export type ImportMap = { imports: Record<string, unknown> };

export type Navigate = (to: string, opts?: { replace?: boolean }) => void;

export type StartOptions = {
  importmap: string;
  lang: string;
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
};
