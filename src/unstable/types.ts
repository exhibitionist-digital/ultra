import type { FunctionComponent } from "react";

export type RequestContext = {
  url: URL;
};

// deno-lint-ignore ban-types
export type AppProps<P = {}> = P & {
  requestContext: RequestContext;
};

export type AppComponent = FunctionComponent<AppProps>;

export type ServerOptions = {
  createRequestContext?:
    ((request: Request) => Promise<RequestContext> | RequestContext);
};

export type RenderOptions = {};
