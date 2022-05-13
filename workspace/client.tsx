import { SWRConfig } from "swr";
import { hydrateRoot } from "react-dom/client";
import App from "./src/app.tsx";

function BrowserApp() {
  return (
    <SWRConfig
      // deno-lint-ignore no-explicit-any
      value={{ provider: () => new Map(window.__ultra_state.cache as any) }}
    >
      <App state={window.__ultra_state} />
    </SWRConfig>
  );
}

hydrateRoot(document, <BrowserApp />);
