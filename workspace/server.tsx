import createServer from "../server.ts";
import { reactHelmetPlugin } from "../src/plugins/react-helmet.ts";
import { ServerAppProps } from "../src/types.ts";
import App from "./src/app.tsx";

function ServerApp({ state }: ServerAppProps) {
  return <App state={state} />;
}

const server = await createServer(ServerApp, {
  mode: "development",
  bootstrapModules: ["./client.tsx"],
});

server.register(reactHelmetPlugin);

server.start({ port: 8000 });
