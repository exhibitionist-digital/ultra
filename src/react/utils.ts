/**
 * All of this has been taken from {@link https://github.com/brillout/react-streaming}
 * and modified to work within Deno
 *
 * If we can get a Deno native module {@link https://github.com/brillout/react-streaming/issues/3}
 * we should be able to just use it as a dependency
 */

export function isServerSide() {
  return !isClientSide();
}

export function isClientSide() {
  return "Deno" in window === false;
}

export function assert(
  condition: unknown,
  debugInfo?: unknown,
): asserts condition {
  if (condition) return;

  const debugStr = debugInfo &&
    (typeof debugInfo === "string"
      ? debugInfo
      : "`" + JSON.stringify(debugInfo) + "`");

  throw new Error([debugStr].filter(Boolean).join(" "));
}
