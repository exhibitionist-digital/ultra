import type { Context, Next } from "../types.ts";
import { getFilePath, getMimeType, toFileUrl } from "../deps.ts";
import { log } from "../logger.ts";

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
      const response = await fetch(toFileUrl(path));
      const headers = new Headers(response.headers);

      if (response.ok) {
        if (options.cache) {
          headers.append(
            "Cache-Control",
            "public, max-age=31536000, immutable",
          );
        }

        const mimeType = getMimeType(path) || headers.get("content-type");

        if (mimeType) {
          headers.append("Content-Type", mimeType);
        }

        return new Response(
          response.body,
          { status: 200, headers },
        );
      } else {
        log.warning(`Static file: ${path} is not found`);
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
      log.debug(`Static file: ${path} does not exist, continuing`);
      await next();
    }
  };
};
