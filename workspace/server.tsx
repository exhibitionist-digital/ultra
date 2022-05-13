import ultra from "../server.ts";
import { ServerAppProps } from "../src/types.ts";
import App from "./src/app.jsx";

function ServerApp({ state }: ServerAppProps) {
  return <App />;
}

const server = await ultra(ServerApp, {
  mode: "development",
  bootstrapModules: ["./client.tsx"],
});

server.start({ port: 8000 });
