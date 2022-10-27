import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import { TRPCClientProvider } from "./src/trpc/client.tsx";

hydrate(
  document,
  <TRPCClientProvider>
    <App />
  </TRPCClientProvider>,
);
