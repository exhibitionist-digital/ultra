import ultra from "../server.ts";
import { reactHelmetPlugin } from "../src/plugins/react-helmet.ts";
import { ServerAppProps } from "../src/types.ts";
import App from "./src/app.tsx";

function ServerApp({ state }: ServerAppProps) {
  return <App state={state} />;
}

const server = await ultra(ServerApp, {
  mode: "development",
  bootstrapModules: ["./client.tsx"],
});

server.register(reactHelmetPlugin);

server.start({ port: 8000 });
