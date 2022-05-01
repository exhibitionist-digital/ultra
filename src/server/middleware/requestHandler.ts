import renderPage from "./renderPage.ts";
import staticAsset from "./staticAsset.ts";
import transpileSource from "./transpileSource.ts";
import vendorMap from "./vendorMap.ts";
import { Middleware } from "../../types.ts";

export default async function requestHandler(): Promise<Middleware> {
  const transpileMiddleware = await transpileSource();
  const staticAssetMiddleware = await staticAsset();
  const vendorMapMiddleware = await vendorMap();
  const renderPageMiddleware = await renderPage();

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
