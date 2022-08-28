import type { Context, Next } from "../types.ts";
import { getFilePath, getMimeType, toFileUrl } from "../deps.ts";

export type ServeStaticOptions = {
  root?: string;
  path?: string;
  cache?: boolean;
};

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
    });

    path = `/${path}`;

    try {
      const file = await fetch(toFileUrl(path)).then((response) =>
        response.body
      );

      if (file) {
        if (options.cache) {
          context.header(
            "Cache-Control",
            "public, max-age=31536000, immutable",
          );
        }

        const mimeType = getMimeType(path);
        if (mimeType) {
          context.header("Content-Type", mimeType);
        }
        // Return Response object
        return context.body(file, 200);
      } else {
        console.warn(`Static file: ${path} is not found`);
        await next();
      }

      return;
    } catch (_error) {
      /**
       * This is so we can just continue the request if the above fetch fails,
       * since the static asset might not exist, and we want to avoid Deno APIs
       * in the runtime as much as possible.
       *
       * TODO: Maybe we should handle the type of error that fetch would throw?
       */
      console.debug(`Static file: ${path} does not exist, continuing`);
      await next();
    }
  };
};
