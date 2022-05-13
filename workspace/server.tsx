import { Router } from "wouter";
import createServer from "../server.ts";
import { reactHelmetPlugin } from "../src/plugins/react-helmet.ts";
import { ServerAppProps } from "../src/types.ts";
import App from "./src/app.tsx";

function ServerApp({ state }: ServerAppProps) {
  return (
    <Router hook={staticLocationHook(state.url.pathname)}>
      <App state={state} />
    </Router>
  );
}

const server = await createServer(ServerApp, {
  mode: "development",
  bootstrapModules: ["./client.tsx"],
});

server.register(reactHelmetPlugin);
server.start({ port: 8000 });

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
