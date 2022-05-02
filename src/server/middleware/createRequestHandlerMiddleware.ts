import assets from "../../assets.ts";
import createRenderPageMiddleware from "./createRenderPageMiddleware.ts";
import createStaticAssetMiddleware from "./createStaticAssetMiddleware.ts";
import createTranspileSourceMiddleware from "./createTranspileSourceMiddleware.ts";
import createVendorMapMiddleware from "./createVendorMapMiddleware.ts";
import { Middleware } from "../../types.ts";
import { compose } from "../middleware.ts";
import { resolveConfig, resolveImportMap } from "../../config.ts";
import { sourceDirectory, vendorDirectory } from "../../env.ts";

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

  return compose(
    createTranspileSourceMiddleware(
      rawAssets,
      importMap,
    ),
    createStaticAssetMiddleware(rawAssets),
    createVendorMapMiddleware(vendorAssets),
    createRenderPageMiddleware(importMap),
  );
}
