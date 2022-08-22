import { Context, Next, readableStreamFromReader } from "../deps.ts";
import { getFilePath, getMimeType } from "../deps.ts";

export type ServeStaticOptions = {
  root?: string;
  path?: string;
};

const DEFAULT_DOCUMENT = "index.html";

export const serveStatic = (options: ServeStaticOptions = { root: "" }) => {
  return async (
    context: Context,
    next: Next,
  ): Promise<Response | undefined> => {
    // Do nothing if Response is already set
    if (context.res && context.finalized) {
      await next();
    }

    const url = new URL(context.req.url);

    let path = getFilePath({
      filename: options.path ?? url.pathname,
      root: options.root,
      defaultDocument: DEFAULT_DOCUMENT,
    });

    path = `./${path}`;

    const file = await Deno.open(path, { read: true });
    const fileStream = readableStreamFromReader(file);

    if (fileStream) {
      context.header("Cache-Control", "public, max-age=31536000, immutable");

      const mimeType = getMimeType(path);
      if (mimeType) {
        context.header("Content-Type", mimeType);
      }
      // Return Response object
      return context.body(fileStream, 200);
    } else {
      console.warn(`Static file: ${path} is not found`);
      await next();
    }
    return;
  };
};
