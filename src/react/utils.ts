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
