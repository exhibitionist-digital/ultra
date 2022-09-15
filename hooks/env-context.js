import { createContext } from "react";

/**
 * @type {React.Context<Map<string, string>>}
 */
const EnvContext = createContext(
  typeof window === "undefined"
    ? new Map()
    : new Map(Object.fromEntries(globalThis.__ULTRA_ENV)),
);

export default EnvContext;
