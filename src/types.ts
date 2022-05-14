import type { FunctionComponent } from "react";
import { Application } from "./app.ts";
import { Context } from "./context.ts";
import type { HTMLRewriter, ParseOptions } from "./deps.ts";

export type ImportMap = { imports: Record<string, string> };

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

export type RenderStrategy = "stream" | "static";

export type RenderStateFactory = ((
  request: Request,
) => Promise<State> | State);

export type CreateRouterOptions = {
  renderHandler: RequestHandler;
  rootUrl: URL;
  publicPath: string;
  compilerPath: string;
};

export type RenderOptions = {
  strategy?: RenderStrategy;
  bootstrapModules: string[];
};

export type Mode = "development" | "debug" | "production";

export type ApplicationOptions = {
  rootUrl: URL | string;
  mode: Mode;
};

export type ContextOptions = {
  app: Application;
  request: Request;
};

export type State = {
  [key: string]: unknown;
  url: URL;
};

export type CompilerOptions = {
  mode: Mode;
  parserOptions?: ParseOptions;
};

export type CompileOptions = {
  input: string;
  url: URL;
};

export type RequestHandler = (context: Context) => Promise<unknown> | unknown;
export type Middleware = (next: RequestHandler) => RequestHandler;

export type ResponseTransformer = ((
  response: Response,
  context: Context,
  rewriter: HTMLRewriter,
) => void | Promise<void>);

// deno-lint-ignore no-explicit-any
export type PluginOptions = Record<string, any>;

export interface Register<T = void> {
  <Options extends PluginOptions>(
    plugin: Plugin<Options>,
    options?: Options,
  ): T;
}

export type Plugin<Options extends PluginOptions = Record<never, never>> = (
  instance: Application,
  options: Options,
) => Promise<void> | void;

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
