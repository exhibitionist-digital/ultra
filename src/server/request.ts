export function createURL(request: Request): URL {
  const url = new URL(request.url);

  const xForwardedProto = request.headers.get("x-forwarded-proto");
  if (xForwardedProto) {
    url.protocol = `${xForwardedProto}:`;
  }

  const xForwardedHost = request.headers.get("x-forwarded-host");
  if (xForwardedHost) {
    url.hostname = xForwardedHost;
  }

  return url;
}
