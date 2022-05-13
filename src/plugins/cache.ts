import type { Plugin } from "../deps.ts";
import { LRU } from "../deps.ts";
import { isGetRequest } from "../utils.ts";

const cache = new LRU<Response>(500);

const X_RESPONSE_CACHE = "x-response-cache";
const X_RESPONSE_CACHE_HIT = "hit";
const X_RESPONSE_CACHE_MISS = "miss";

function isCacheableRequest(request: Request) {
  return isGetRequest(request);
}

function isCacheableResponse(response: Response) {
  return response.status === 200;
}

async function buildCacheKey(request: Request, headers?: string[]) {
  const { url, headers: requestHeaders } = request;

  const additionalCondition = headers?.reduce((acc, header) => {
    return `${acc}__${header}:${requestHeaders.get(header) || ""}`;
  }, "");

  const data = `${url}__${additionalCondition}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-1", encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

  return hashHex;
}

function waitForCacheFulfilled(key: string) {
  return new Promise<Response | undefined>((resolve) => {
    const cached = cache.get(key);
    if (cached instanceof Response) {
      resolve(cached.clone());
    }
  });
}

export const cachePlugin: Plugin = (app) => {
  app.before((next) => {
    return async function middleware(context) {
      const { request } = context;

      if (isCacheableRequest(request)) {
        const key = await buildCacheKey(request);
        const isRequestCached = cache.get(key);

        if (isRequestCached) {
          const cached = await waitForCacheFulfilled(key);

          if (cached) {
            const headers = new Headers(cached.headers);
            headers.set(X_RESPONSE_CACHE, X_RESPONSE_CACHE_HIT);

            return new Response(cached.body, {
              headers,
              status: cached.status,
            });
          }
        }
      }

      return next(context);
    };
  });

  app.use((next) => {
    return async function middleware(context) {
      const { request } = context;
      const response = await next(context) as Response;

      if (isCacheableRequest(request)) {
        const key = await buildCacheKey(request);

        if (isCacheableResponse(response)) {
          response.headers.set(X_RESPONSE_CACHE, X_RESPONSE_CACHE_MISS);
          cache.set(key, response.clone());

          return response;
        }
      }

      return next(context);
    };
  });
};
