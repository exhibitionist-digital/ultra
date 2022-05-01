import { format, parse, resolve, toFileUrl } from "./deps.ts";
import { apiDirectory } from "./env.ts";

export type ValidExtensions = ".js" | ".jsx" | ".ts" | ".tsx";

export const replaceFileExt = (
  file: string,
  extension: ValidExtensions,
): string => {
  file = format({ ...parse(file), base: "", ext: extension });
  return file.replaceAll("\\", "/");
};

export const isValidUrl = (url: string): URL | false => {
  try {
    return new URL(url);
  } catch (_e) {
    return false;
  }
};

export const stripTrailingSlash = (url: string): string => {
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const resolveFileUrl = (from: string, to: string) => {
  return new URL(toFileUrl(resolve(from, to)).toString());
};

export const isRemoteSource = (value: string): boolean => {
  return value.startsWith("https://") ||
    value.startsWith("http://");
};

export const isVendorSource = (
  value: string,
  vendorDirectory: string,
): boolean => {
  return value.includes(`.ultra/${vendorDirectory}`);
};

export const isApiRoute = (value: string): boolean => {
  return value.includes(apiDirectory);
};
