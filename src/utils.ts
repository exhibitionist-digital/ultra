import {
  dirname,
  extname,
  fromFileUrl,
  join,
  normalize,
  toFileUrl,
} from "./deps.ts";

export function relativeImportMetaPath(path: string, importMetaUrl: string) {
  const importPathname = importMetaUrl.startsWith("http")
    ? new URL(path, importMetaUrl)
    : fromFileUrl(importMetaUrl);

  if (importPathname instanceof URL) {
    return importPathname;
  }

  const result = join(
    dirname(importPathname),
    normalize(path),
  );

  return toFileUrl(result);
}

export function hasTrailingSlash(input: string): boolean {
  if (input.length > 1 && input[input.length - 1] === "/") {
    return true;
  }

  return false;
}

export function removeTrailingSlash(input: string): string {
  if (hasTrailingSlash(input)) {
    input = input.slice(0, input.length - 1);
  }
  return input;
}

export function isHtmlResponse(
  response: Response,
) {
  return response.headers.get("content-type")?.includes(
    "text/html",
  ) || false;
}

export function isGetRequest(request: Request) {
  return request.method === "GET";
}

export function toCompilerUrl(path: string, pathPrefix: string) {
  return join(pathPrefix, `${path}.js`);
}

export function getReferringScriptUrl(request: Request) {
  return new URL(request.referrer || request.url);
}

export function toLocalPathname(pathname: string, pathPrefix: string) {
  const extension = extname(pathname);
  return pathname.replace(pathPrefix, "").slice(0, -extension.length);
}

export function toUrl(path: string) {
  return path.startsWith("file://") ? toFileUrl(path) : new URL(path);
}

export async function loadSource(path: string | URL) {
  const url = typeof path === "string"
    ? path.startsWith("file://") ? toFileUrl(fromFileUrl(path)) : new URL(path)
    : path;

  const content = url.protocol === "file:"
    ? await Deno.readTextFile(url)
    : await (await fetch(url.toString(), { cache: "no-cache" })).text();

  return content;
}
