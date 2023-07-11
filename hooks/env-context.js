import { createContext } from "react";

/**
 * @type {Map<string, string>}
 */
export const env = typeof Deno === "undefined"
  ? new Map(globalThis.__ULTRA_ENV || [])
  : new Map(Object.entries(Deno.env.toObject()));

const EnvContext = createContext(env);

export default EnvContext;
