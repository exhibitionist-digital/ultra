import { dirname, extname, fromFileUrl, join, normalize } from "./deps.ts";

export function relativeImportMetaPath(path: string, importMetaUrl: string) {
  return join(
    dirname(fromFileUrl(importMetaUrl)),
    normalize(path),
  );
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

const decoder = new TextDecoder();

export async function readFileAndDecode(path: string | URL) {
  return decoder.decode(await Deno.readFile(path));
}
