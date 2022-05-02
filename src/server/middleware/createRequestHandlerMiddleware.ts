import assets from "../../assets.ts";
import createRenderPageMiddleware from "./createRenderPageMiddleware.ts";
import createStaticAssetMiddleware from "./createStaticAssetMiddleware.ts";
import createTranspileSourceMiddleware from "./createTranspileSourceMiddleware.ts";
import createVendorMapMiddleware from "./createVendorMapMiddleware.ts";
import { Middleware } from "../../types.ts";
import { sourceDirectory, vendorDirectory } from "../../env.ts";

function createNextResolver(fn: () => Promise<void>) {
  return async (shortCircuit?: boolean) => {
    if (shortCircuit) {
      return;
    }

    await fn();
  };
}

export default async function createRequestHandlerMiddleware(): Promise<
  Middleware
> {
  const rawAssets = await assets(sourceDirectory);
  const vendorAssets = await assets(`.ultra/${vendorDirectory}`);

  const transpileMiddleware = await createTranspileSourceMiddleware(rawAssets);
  const staticAssetMiddleware = createStaticAssetMiddleware(rawAssets);
  const vendorMapMiddleware = createVendorMapMiddleware(
    vendorAssets,
  );
  const renderPageMiddleware = await createRenderPageMiddleware();

  // Oh no, callback hell all over again! :D
  return async function requestHandlerMiddleware(context, next) {
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
