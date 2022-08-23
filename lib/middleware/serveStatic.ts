import { Context, Next, readableStreamFromReader } from "../deps.ts";
import { getFilePath, getMimeType } from "../deps.ts";
import { exists } from "../utils/fs.ts";

export type ServeStaticOptions = {
  root?: string;
  path?: string;
  cache?: boolean;
};

const modeFromEnv = Deno.env.get("ULTRA_MODE") ||
  (Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined ? "production" : undefined);

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

    path = `./${path}`;

    if (await exists(path)) {
      const file = await Deno.open(path, { read: true });
      const fileStream = readableStreamFromReader(file);

      if (fileStream) {
        if (modeFromEnv === "production" && options.cache) {
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
        return context.body(fileStream, 200);
      } else {
        console.warn(`Static file: ${path} is not found`);
        await next();
      }
      return;
    }

    await next();
  };
};
