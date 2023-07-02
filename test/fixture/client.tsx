import { setup } from "@twind/core";
import hydrate from "ultra/hydrate.js";
import App from "@/app.tsx";
import { TRPCClientProvider } from "@/trpc/client.tsx";
import { sheet } from "@/twind.ts";
import config from "@/twind.config.js";

//@ts-ignore twind types issue
setup(config, sheet);

hydrate(
  document,
  <TRPCClientProvider>
    <App />
  </TRPCClientProvider>,
);
