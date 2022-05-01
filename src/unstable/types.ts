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
  locale?: string;
  renderStrategy?: RenderStrategy;
};

export type RequestContextFactory = ((
  request: Request,
) => Promise<RequestContext> | RequestContext);

export type CreateRequestHandlerOptions = {
  render: Renderer;
  createRequestContext: RequestContextFactory;
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

export type AppComponent<T extends AppProps> = FunctionComponent<T>;

export type ServerOptions = {
  createRequestContext?: ((
    request: Request,
  ) => Promise<RequestContext> | RequestContext);
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
