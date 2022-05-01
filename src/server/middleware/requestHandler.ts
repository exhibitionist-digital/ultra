import { LRU } from "../../deps.ts";
import { Assets, ImportMap, Middleware } from "../../types.ts";
import renderPage from "./renderPage.ts";
import staticAsset from "./staticAsset.ts";
import transpileSource from "./transpileSource.ts";
import vendorMap from "./vendorMap.ts";

export default function requestHandler(
  importMap: ImportMap,
  language: string,
  memory: LRU<string>,
  rawAssets: Assets,
  sourceDirectory: string,
  vendorAssets: Assets,
): Middleware {
  const transpileMiddleware = transpileSource(
    memory,
    rawAssets,
    importMap,
    sourceDirectory,
  );
  const staticAssetMiddleware = staticAsset(rawAssets, sourceDirectory);
  const vendorMapMiddleware = vendorMap(vendorAssets);
  const renderPageMiddleware = renderPage(
    language,
    importMap,
  );

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
