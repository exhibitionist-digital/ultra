import { Compiler } from "./compiler.ts";
import { Context } from "./context.ts";
import {
  basename,
  expandGlob,
  ExpandGlobOptions,
  Handler,
  HTMLRewriter,
  join,
  Server,
  toFileUrl,
} from "./deps.ts";
import { Router } from "./router.ts";
import {
  ApplicationOptions,
  Middleware,
  Mode,
  Register,
  RequestHandler,
  ResponseTransformer,
} from "./types.ts";
import { ApplicationEvents, ListeningEvent } from "./events.ts";
import { loadSource, relativeImportMetaPath } from "./utils.ts";
import { Sources } from "./dev.ts";

const extensions = [".tsx", ".ts", ".jsx", ".js"];
const globPattern = `**/*+(${extensions.join("|")})`;

/**
 * Based on the work of abc {@link https://github.com/zhmushan/abc/blob/master/app.ts}
 */
export class Application extends ApplicationEvents {
  #server: Server | undefined;
  #router: Router;
  #middleware: Middleware[] = [];
  #requestMiddleware: Middleware[] = [];
  #responseTransformers: ResponseTransformer[] = [];
  #process?: Promise<void>;

  readonly rootUrl: URL;
  readonly compiler: Compiler;
  readonly mode: Mode;
  sources: Sources = new Sources(loadSource);

  constructor(options: ApplicationOptions) {
    super();

    const { rootUrl, mode } = options;

    this.#router = new Router();
    this.rootUrl = typeof rootUrl === "string" ? toFileUrl(rootUrl) : rootUrl;
    this.mode = mode;

    this.compiler = new Compiler({
      mode,
    });
  }

  start(listenOptions: Deno.ListenOptions): void {
    this.dispatchEvent(new ListeningEvent(listenOptions));
    this.#process = this.#start(Deno.listen(listenOptions));
  }

  async close(): Promise<void> {
    if (this.#server) {
      this.#server.close();
    }
    await this.#process;
  }

  async #start(listener: Deno.Listener): Promise<void> {
    const handler: Handler = (request) => {
      const context = new Context({
        app: this,
        request,
      });

      let requestHandler: RequestHandler;

      if (this.#requestMiddleware.length === 0) {
        requestHandler = this.#router.find(request.method, context);
        requestHandler = this.#applyMiddleware(
          requestHandler,
          ...this.#middleware,
        );
      } else {
        requestHandler = (context) => {
          requestHandler = this.#router.find(request.method, context);
          requestHandler = this.#applyMiddleware(
            requestHandler,
            ...this.#middleware,
          );
          return requestHandler(context);
        };
        requestHandler = this.#applyMiddleware(
          requestHandler,
          ...this.#requestMiddleware,
        );
      }

      return this.#transformResult(context, requestHandler).then(() =>
        context.response
      );
    };

    const server = this.#server = new Server({
      handler,
      onError: this.#handleError,
    });

    await server.serve(listener);
  }

  #handleError(error: unknown) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }

  #applyMiddleware = (
    handler: RequestHandler,
    ...middleware: Middleware[]
  ): RequestHandler => {
    for (let i = middleware.length - 1; i >= 0; --i) {
      handler = middleware[i](handler);
    }

    return handler;
  };

  async resolveSources() {
    try {
      const globOptions: ExpandGlobOptions = {
        root: this.rootUrl.pathname,
        /**
         * Might need a better way of defining this... maybe configurable?
         *
         * This excludes certain directories/files from being considered
         * valid compile targets and preventing a request for
         * http://localhost/@compiler/ultra/server.tsx.js and being sent the compiled source.
         */
        exclude: [
          "vendor",
          "tests",
          ".ultra",
          /**
           * Note[deckchairlabs]: Deno.mainModule is undefined on Deno Deploy
           * At least, the last time I checked...
           */
          basename(Deno.mainModule),
        ],
      };

      /**
       * An array of Ultra paths sources that can be compiled
       * and served to a browser client.
       */
      const ultraSources = [
        join("..", "react.ts"),
        join(".", "react", "client.ts"),
        join(".", "react", "useSsrData.ts"),
        join(".", "react", "useStream.ts"),
        join(".", "react", "utils.ts"),
      ];

      for (const ultra of ultraSources) {
        this.sources.load(
          relativeImportMetaPath(ultra, import.meta.url),
        );
      }

      for await (const file of expandGlob(globPattern, globOptions)) {
        this.sources.load(toFileUrl(file.path));
      }

      return this.sources;
    } catch (error) {
      throw error;
    }
  }

  /**
   * `before` adds middleware which is run before routing.
   */
  before(...middlewares: Middleware[]): this {
    this.#requestMiddleware.push(...middlewares);
    return this;
  }

  /**
   * `use` adds middleware to be run after the router.
   */
  use(...middlewares: Middleware[]): this {
    this.#middleware.push(...middlewares);
    return this;
  }

  connect(
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    return this.add("CONNECT", path, requestHandler, ...middleware);
  }

  delete(
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    return this.add("DELETE", path, requestHandler, ...middleware);
  }

  get(
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    return this.add("GET", path, requestHandler, ...middleware);
  }

  head(
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    return this.add("HEAD", path, requestHandler, ...middleware);
  }

  options(
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    return this.add("OPTIONS", path, requestHandler, ...middleware);
  }

  patch(
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    return this.add("PATCH", path, requestHandler, ...middleware);
  }

  post(
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    return this.add("POST", path, requestHandler, ...middleware);
  }

  put(
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    return this.add("PUT", path, requestHandler, ...middleware);
  }

  trace(
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    return this.add("TRACE", path, requestHandler, ...middleware);
  }

  any(
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    const methods = [
      "CONNECT",
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT",
      "TRACE",
    ];

    return this.match(methods, path, requestHandler, ...middleware);
  }

  match(
    methods: string[],
    path: string,
    requestHandler: RequestHandler,
    ...middleware: Middleware[]
  ): Application {
    for (const method of methods) {
      this.add(method, path, requestHandler, ...middleware);
    }
    return this;
  }

  add(
    method: string,
    path: string,
    requestHandler: RequestHandler,
    ...middlewares: Middleware[]
  ): Application {
    this.#router.add(
      method,
      path,
      (context: Context): Promise<unknown> | unknown => {
        let routeHandler = requestHandler;
        for (const middleware of middlewares) {
          routeHandler = middleware(routeHandler);
        }
        return routeHandler(context);
      },
    );

    return this;
  }

  register: Register<Application> = (plugin, options) => {
    // deno-lint-ignore no-explicit-any
    const promise = plugin(this, options || {} as any);

    if (promise) {
      promise.then(() => ({}));
    }

    return this;
  };

  addResponseTransformer(responseTransformer: ResponseTransformer) {
    this.#responseTransformers.push(responseTransformer);
  }

  async #applyResponseTransformers(
    response: Response,
    context: Context,
    ...responseTransformers: ResponseTransformer[]
  ): Promise<Response> {
    const rewriter = new HTMLRewriter();

    for (let i = responseTransformers.length - 1; i >= 0; --i) {
      await responseTransformers[i](response, context, rewriter);
    }

    response = rewriter.transform(response);

    return response;
  }

  async #transformResult(
    context: Context,
    requestHandler: RequestHandler,
  ): Promise<void> {
    const result = await requestHandler(context);

    if (result instanceof Response) {
      context.response = await this.#applyResponseTransformers(
        result,
        context,
        // We reverse the transformers here as we wan't them in the order
        // that would have been defined by the developer
        ...this.#responseTransformers.reverse(),
      );
    }
  }
}
