import UltraClient, { hydrate } from "ultra/lib/react/client.js";
import App from "/~/app.tsx";

hydrate(
  document,
  <UltraClient>
    <App />
  </UltraClient>,
);
