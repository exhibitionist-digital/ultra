import { Context, Next, toFileUrl } from "../deps.ts";
import { getFilePath, getMimeType } from "../deps.ts";
import { exists } from "../utils/fs.ts";

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

    if (await exists(path)) {
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
    }

    await next();
  };
};
