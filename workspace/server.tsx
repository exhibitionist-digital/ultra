import { SWRConfig } from "swr";
import { Router } from "wouter";
import createServer from "../server.ts";
import { reactHelmetPlugin } from "../src/plugins/react-helmet.ts";
import { ServerAppProps } from "../src/types.ts";
import App from "./src/app.tsx";

/**
 * API handlers
 */
import helloWorldHandler from "./api/example.js";

/**
 * This is the component that will be rendered server side.
 */
const cache = new Map<string, any>();

function ServerApp({ state }: ServerAppProps) {
  return (
    <SWRConfig
      value={{
        suspense: true,
        provider: () => {
          return state.cache = cache;
        },
        fetcher: (resource, init) => {
          console.log(`Server fetching: ${resource}`);
          return fetch(resource, init).then((res) => res.json());
        },
      }}
    >
      <Router hook={staticLocationHook(state.url.pathname)}>
        <App state={state} />
      </Router>
    </SWRConfig>
  );
}

const server = await createServer(ServerApp, {
  mode: "development",
  bootstrapModules: ["./client.tsx"],
});

/**
 * Custom routes
 */
server.get("/api/hello", helloWorldHandler);

/**
 * Middleware
 */
server.use((next) => {
  return async function requestHandler(context) {
    const startTime = performance.now();
    const response = await next(context);
    const endTime = performance.now();

    console.log(
      `[${context.request.method}]: ${context.url.toString()} duration ${
        (endTime - startTime).toFixed(2)
      }ms`,
    );

    return response;
  };
});

/**
 * Register server plugins
 */
server.register(reactHelmetPlugin);

/**
 * Start the server!
 */
server.start({ port: 8000 });

/**
 * Server side wouter
 */
type Navigate = (to: string, opts?: { replace?: boolean }) => void;

function staticLocationHook(
  path = "/",
  { record = false } = {},
) {
  // deno-lint-ignore prefer-const
  let hook: { history?: string[] } & (() => [string, Navigate]);

  const navigate: Navigate = (to, { replace } = {}) => {
    if (record) {
      if (replace) {
        hook.history?.pop();
      }
      hook.history?.push(to);
    }
  };

  hook = () => [path, navigate];
  hook.history = [path];

  return hook;
}
