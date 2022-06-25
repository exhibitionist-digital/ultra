import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";
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

function ServerApp({ state }: ServerAppProps) {
  return (
    <Router hook={staticLocationHook(state.url.pathname)}>
      <App state={state} />
    </Router>
  );
}

const server = await createServer(ServerApp, {
  mode: "production",
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
