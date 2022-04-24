import type { FunctionComponent } from "react";
import type { HelmetServerState } from "react-helmet";
import { ImportMapResolver } from "../importMapResolver.ts";

export type ServerRequestContext = {
  url: URL;
  state: Map<unknown, unknown>;
  helmetContext: {
    helmet: HelmetServerState;
  };
  locale?: string;
  renderStrategy?: RenderStrategy;
};

// deno-lint-ignore ban-types
export type AppProps<P = {}> = P & {
  requestContext: ServerRequestContext;
};

export type AppComponent = FunctionComponent<AppProps>;

export type ServerOptions = {
  createRequestContext?: ((
    request: Request,
  ) => Promise<ServerRequestContext> | ServerRequestContext);
};

export type RenderOptions = {
  requestContext: ServerRequestContext;
  importMapResolver: ImportMapResolver;
  chunkSize?: number;
};

export type RenderStrategy = "stream" | "static";
