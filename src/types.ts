import type { FunctionComponent } from "react";
import type { Mode, RequestHandler, State } from "./deps.ts";
import { Application } from "./app.ts";

export type ImportMap = { imports: Record<string, string> };

export type Navigate = (to: string, opts?: { replace?: boolean }) => void;
export type RenderStrategy = "stream" | "static";

export type ServerAppProps = {
  state: State;
};

export type ServerAppComponent = FunctionComponent<ServerAppProps>;

export type ServerOptions = {
  mode?: Mode;
  rootUrl?: URL;
  publicPath?: string;
  compilerPath?: string;
  context?: RenderStateFactory;
  /**
   * The modules provided here are injected into the HTML response.
   * You ususally want to include the module that hydrates your application.
   */
  bootstrapModules?: string[];
};

export type RenderStateFactory = ((
  request: Request,
) => Promise<State> | State);
export type CreateRouterOptions = {
  renderHandler: RequestHandler<Application>;
  rootUrl: URL;
  publicPath: string;
  compilerPath: string;
};

export type RenderOptions = {
  strategy?: RenderStrategy;
  bootstrapModules: string[];
};

export type Config = {
  importMap?: string;
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

export type Cache = Map<unknown, unknown>;

export type APIHandler = (request: Request) => Response | Promise<Response>;
