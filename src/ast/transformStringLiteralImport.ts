import { StringLiteral } from "../deps.ts";
import { ImportMap } from "../types.ts";
import { cacheBuster } from "../utils/cacheBuster.ts";
import { isApiRoute } from "../utils/isApiRoute.ts";
import { isRemoteSource } from "../utils/isRemoteSource.ts";

export function transformStringLiteralImport(
  stingLiteral: StringLiteral,
  importMap: ImportMap,
  cacheTimestamp?: number,
) {
  const { value } = stingLiteral;
  const importMapResolved = importMap.imports[value] || value;

  stingLiteral.value = importMapResolved.replace(
    "./.ultra",
    "",
  );

  const isCacheBustable = !isRemoteSource(importMapResolved) &&
    !isApiRoute(importMapResolved) && cacheTimestamp;

  if (isCacheBustable) {
    stingLiteral.value = cacheBuster(
      stingLiteral.value,
      cacheTimestamp,
    );
  }

  //@ts-ignore StringLiteral missing raw field
  stingLiteral.raw = `"${stingLiteral.value}"`;

  return stingLiteral;
}
