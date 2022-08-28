import { ULTRA_STATIC_PATH } from "../constants.ts";
import { join, toFileUrl } from "../deps.ts";
import type { Context, Next } from "../types.ts";

export const serveCompiled = (
  { root, cache }: { root: string; cache?: boolean },
) => {
  return async (
    context: Context,
    next: Next,
  ): Promise<Response | undefined> => {
    const pathname = new URL(context.req.url).pathname.replace(
      ULTRA_STATIC_PATH,
      "",
    );

    const filepath = join(root, pathname);

    try {
      const file = await fetch(toFileUrl(filepath)).then((response) =>
        response.body
      );
      context.header("Content-Type", "text/javascript");
      if (cache) {
        context.header("Cache-Control", "public, max-age=31536000, immutable");
      }
      return context.body(file, 200);
    } catch (_error) {
      /**
       * This is so we can just continue the request if the above fetch fails,
       * since the compiled asset might not exist, and we want to avoid Deno APIs
       * in the runtime as much as possible.
       *
       * TODO: Maybe we should handle the type of error that fetch would throw?
       */
      console.debug(`Compiled file: ${filepath} not found`);
      await next();
    }
  };
};
