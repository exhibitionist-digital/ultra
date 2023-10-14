import { join } from "https://deno.land/std@0.203.0/url/mod.ts";
import { type RequestHandler } from "../handler.ts";

type StaticHandlerOptions = {
  pathToRoot: URL | string;
  prefix?: string; 
};

export function createStaticHandler(
  options: StaticHandlerOptions,
): RequestHandler {
  const {
    pathToRoot,
    prefix = "/"
  } = options;

  const root = new URL(pathToRoot.toString(), import.meta.url);

  const handleRequest = async (request: Request): Promise<Response> => {
    const { pathname } = new URL(request.url);
    const filePath = pathname.replace(prefix, "./");
    const fileUrl = join(root, filePath);

    // See https://docs.deno.com/runtime/tutorials/file_server#example
    let file;
    try {
      file = await Deno.open(fileUrl, { read: true });
    } catch {
      // If the file cannot be opened, return a "404 Not Found" response
      throw "Can't handle this request";
    }

    // Build a readable stream so the file doesn't have to be fully loaded into
    // memory while we send it
    const readableStream = file.readable;

    // Build and send the response
    return new Response(readableStream);
  };

  const supportsRequest = (request: Request): boolean => {
    return true; // use it as a fallback for now
  };

  return {
    supportsRequest,
    handleRequest,
  };
}
