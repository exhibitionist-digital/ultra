import renderPage from "./renderPage.ts";
import staticAsset from "./staticAsset.ts";
import transpileSource from "./transpileSource.ts";
import vendorMap from "./vendorMap.ts";
import { Assets, ImportMap, Middleware } from "../../types.ts";

export default function requestHandler(
  importMap: ImportMap,
  rawAssets: Assets,
  vendorAssets: Assets,
): Middleware {
  const transpileMiddleware = transpileSource(
    rawAssets,
    importMap,
  );
  const staticAssetMiddleware = staticAsset(rawAssets);
  const vendorMapMiddleware = vendorMap(vendorAssets);
  const renderPageMiddleware = renderPage(importMap);

  // Oh no, callback hell all over again! :D
  return async (context, next) => {
    await transpileMiddleware(context, async () => {
      await staticAssetMiddleware(context, async () => {
        await vendorMapMiddleware(context, async () => {
          await renderPageMiddleware(context, async () => {
            await next();
          });
        });
      });
    });
  };
}
