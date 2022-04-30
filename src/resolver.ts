import { crypto, format, parse, resolve, toFileUrl } from "./deps.ts";
import { apiDirectory } from "./env.ts";

export type ValidExtensions = ".js" | ".jsx" | ".ts" | ".tsx";

export const replaceFileExt = (
  file: string,
  extension: ValidExtensions,
): string => {
  return format({ ...parse(file), base: "", ext: extension }).replace(
    /\\/g,
    "/",
  );
};

export const isValidUrl = (url: string): URL | false => {
  try {
    return new URL(url);
  } catch (_e) {
    return false;
  }
};

export const hashFile = (url: string): string => {
  // strip query params from hashing
  url = url.split("?")[0];
  const msgUint8 = new TextEncoder().encode(url);
  const hashBuffer = crypto.subtle.digestSync("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return hashHex;
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
