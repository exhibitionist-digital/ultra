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

  throw new Error(
    [
      "[react-streaming][Bug] You stumbled upon a bug in the source code of `react-streaming`.",
      "Reach out at https://github.com/brillout/react-streaming/issues/new and include this error stack",
      "(the error stack is usually enough to fix the problem).",
      debugStr && `(Debug info for the maintainers: ${debugStr})`,
    ]
      .filter(Boolean)
      .join(" "),
  );
}
