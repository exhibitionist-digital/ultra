export function isRemoteSource(value: string) {
  return value.startsWith("https://") ||
    value.startsWith("http://");
}
