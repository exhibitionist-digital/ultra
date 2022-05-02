import { Assets, Middleware } from "../../types.ts";
import { createURL } from "../request.ts";
import { readableStreamFromReader } from "../../deps.ts";
import { sourceDirectory } from "../../env.ts";

export default function createStaticAssetMiddleware(
  rawAssets: Assets,
): Middleware {
  return async function staticAssetMiddleware({ request, response }, next) {
    const url = createURL(request);

    const filePath = `${sourceDirectory}${url.pathname}`;
    if (!rawAssets.raw.has(filePath)) {
      await next();
      return;
    }

    const contentType = rawAssets.raw.get(filePath);
    if (!contentType) {
      response.status = 415;
      response.statusText = "Unsupported Media Type";

      await next(true);
      return;
    }

    response.body = readableStreamFromReader(await Deno.open(`./${filePath}`));
    response.headers = {
      ...response.headers,
      "content-type": contentType,
    };

    await next(true);
  };
}
