import assets from "../../assets.ts";
import createRenderPageMiddleware from "./createRenderPageMiddleware.ts";
import createStaticAssetMiddleware from "./createStaticAssetMiddleware.ts";
import createTranspileSourceMiddleware from "./createTranspileSourceMiddleware.ts";
import createVendorMapMiddleware from "./createVendorMapMiddleware.ts";
import { Middleware } from "../../types.ts";
import { sourceDirectory, vendorDirectory } from "../../env.ts";
import { resolveConfig, resolveImportMap } from "../../config.ts";

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
  const [
    rawAssets,
    vendorAssets,
    importMap,
  ] = await Promise.all([
    assets(sourceDirectory),
    assets(`.ultra/${vendorDirectory}`),
    (async () => {
      const cwd = Deno.cwd();
      const config = await resolveConfig(cwd);
      const importMap = await resolveImportMap(cwd, config);
      return importMap;
    })(),
  ]);

  const transpileMiddleware = createTranspileSourceMiddleware(
    rawAssets,
    importMap,
  );
  const staticAssetMiddleware = createStaticAssetMiddleware(rawAssets);
  const vendorMapMiddleware = createVendorMapMiddleware(
    vendorAssets,
  );
  const renderPageMiddleware = createRenderPageMiddleware(importMap);

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
