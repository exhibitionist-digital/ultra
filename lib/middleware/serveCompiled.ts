import { ULTRA_STATIC_PATH } from "../constants.ts";
import { Context, join, Next, readableStreamFromReader } from "../deps.ts";

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
    const file = await Deno.open(filepath, { read: true });
    const fileStream = readableStreamFromReader(file);

    if (fileStream) {
      context.header("Content-Type", "text/javascript");
      if (cache) {
        context.header("Cache-Control", "public, max-age=31536000, immutable");
      }
      return context.body(fileStream, 200);
    } else {
      console.warn(`Compiled file: ${filepath} not found`);
      await next();
    }
  };
};
