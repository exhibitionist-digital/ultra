import { Assets, Middleware } from "../../types.ts";
import { createURL } from "../request.ts";
import { readableStreamFromReader } from "../../deps.ts";

export default function createVendorMapMiddleware(
  vendorAssets: Assets,
): Middleware {
  return async function vendorMapMiddleware({ request, response }, next) {
    const url = createURL(request);

    if (!vendorAssets.raw.has(`.ultra${url.pathname}`)) {
      await next();
      return;
    }

    const file = await Deno.open(`./.ultra${url.pathname}`);
    const body = readableStreamFromReader(file);

    response.body = body;
    response.headers = {
      ...response.headers,
      "content-type": "application/javascript",
    };

    await next(true);
  };
}
