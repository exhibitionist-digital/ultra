import { readableStreamFromReader } from "../../deps.ts";
import { Assets, Middleware } from "../../types.ts";
import { createURL } from "../request.ts";

export default function staticAsset(
  rawAssets: Assets["raw"],
  sourceDirectory: string,
): Middleware {
  return async ({ request, response }, next) => {
    const url = createURL(request);

    const filePath = `${sourceDirectory}${url.pathname}`;
    if (!rawAssets.has(filePath)) {
      await next();
      return;
    }

    const contentType = rawAssets.get(filePath);
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
