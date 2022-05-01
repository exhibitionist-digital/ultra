import renderPage from "./renderPage.ts";
import staticAsset from "./staticAsset.ts";
import transpileSource from "./transpileSource.ts";
import vendorMap from "./vendorMap.ts";
import { Middleware } from "../../types.ts";

function createNextResolver(fn: () => Promise<void>) {
  return async (shortCircuit?: boolean) => {
    if (shortCircuit) {
      return;
    }

    await fn();
  };
}

export default function requestHandler(): Middleware {
  const transpileMiddlewarePromise = transpileSource();
  const staticAssetMiddlewarePromise = staticAsset();
  const vendorMapMiddlewarePromise = vendorMap();
  const renderPageMiddlewarePromise = renderPage();

  // Oh no, callback hell all over again! :D
  return async (context, next) => {
    const [
      transpileMiddleware,
      staticAssetMiddleware,
      vendorMapMiddleware,
      renderPageMiddleware,
    ] = await Promise.all([
      transpileMiddlewarePromise,
      staticAssetMiddlewarePromise,
      vendorMapMiddlewarePromise,
      renderPageMiddlewarePromise,
    ]);

    await transpileMiddleware(
      context,
      createNextResolver(async () => {
        await staticAssetMiddleware(
          context,
          createNextResolver(async () => {
            await vendorMapMiddleware(
              context,
              createNextResolver(async () => {
                await renderPageMiddleware(
                  context,
                  next,
                );
              }),
            );
          }),
        );
      }),
    );
  };
}
