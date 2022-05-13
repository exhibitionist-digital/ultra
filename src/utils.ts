import { extname, join } from "./deps.ts";

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
  return pathname.replace(pathPrefix, "").replace(
    extension,
    "",
  );
}

const decoder = new TextDecoder();

export async function readFileAndDecode(path: string | URL) {
  return decoder.decode(await Deno.readFile(path));
}
