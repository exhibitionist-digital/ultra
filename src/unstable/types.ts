import type { FunctionComponent } from "react";
import type { HelmetServerState } from "react-helmet";
import { ImportMapResolver } from "../importMapResolver.ts";
import type { ImportMap } from "../types.ts";

export type RequestContext = {
  url: URL;
  state: Map<unknown, unknown>;
  helmetContext: {
    helmet: HelmetServerState;
  };
  locale: string;
  renderStrategy: RenderStrategy;
};

export type RequestContextFunction<T = Partial<RequestContext>> = ((
  request: Request,
) => Promise<T> | T);

export type CreateRequestHandlerOptions = {
  render: Renderer;
  createRequestContext?: RequestContextFunction;
  cwd: string;
  importMap: ImportMap;
  paths: {
    source: string;
    vendor: string;
  };
  isDev?: boolean;
};

// deno-lint-ignore ban-types
export type AppProps<P = {}> = P & {
  requestContext?: RequestContext;
};

export type AppComponent = FunctionComponent;

export type ServerOptions = {
  createRequestContext?: RequestContextFunction;
};

export type RenderOptions = {
  requestContext: RequestContext;
  importMapResolver: ImportMapResolver;
  chunkSize?: number;
};

export type RenderContext = {
  locale?: string;
  strategy: RenderStrategy;
};

export type Renderer = ((context: RequestContext) => Promise<Response>);

export type RenderStrategy = "stream" | "static";
