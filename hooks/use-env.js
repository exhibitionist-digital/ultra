import { useContext, useMemo } from "react";
import EnvContext from "./env-context.js";

/**
 * @param {string} name
 */
export default function useEnv(name) {
  if (
    typeof Deno === "undefined" && name.startsWith("ULTRA_PUBLIC_") === false
  ) {
    throw new Error(`Attempt to access non-public env variable. ${name}`);
  }
  const context = useContext(EnvContext);
  return useMemo(() => context.get(name), [name]);
}
