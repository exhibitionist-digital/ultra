export function cacheBuster(source: string, timestamp?: number) {
  return source.replace(
    /\.(j|t)sx?/gi,
    () => {
      return `.js${timestamp ? `?ts=${timestamp}` : ""}`;
    },
  );
}
