import { createContext } from "react";

/**
 * @type {React.Context<Map<string, string>>}
 */
const EnvContext = createContext(
  typeof Deno === "undefined"
    ? new Map(globalThis.__ULTRA_ENV || [])
    : new Map(),
);

export default EnvContext;
