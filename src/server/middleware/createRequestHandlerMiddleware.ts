import createRenderPageMiddleware from "./createRenderPageMiddleware.ts";
import createStaticAssetMiddleware from "./createStaticAssetMiddleware.ts";
import createTranspileSourceMiddleware from "./createTranspileSourceMiddleware.ts";
import createVendorMapMiddleware from "./createVendorMapMiddleware.ts";
import { Middleware } from "../../types.ts";

function createNextResolver(fn: () => Promise<void>) {
  return async (shortCircuit?: boolean) => {
    if (shortCircuit) {
      return;
    }

    await fn();
  };
}

export default function createRequestHandlerMiddleware(): Middleware {
  const transpileMiddlewarePromise = createTranspileSourceMiddleware();
  const staticAssetMiddlewarePromise = createStaticAssetMiddleware();
  const vendorMapMiddlewarePromise = createVendorMapMiddleware();
  const renderPageMiddlewarePromise = createRenderPageMiddleware();

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
