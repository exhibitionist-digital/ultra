import { crypto, format, parse, resolve, toFileUrl } from "./deps.ts";
import { apiDirectory } from "./env.ts";

export const replaceFileExt = (file: string, ext: string) => {
  const { dir, name } = parse(file);

  return format({ root: "/", dir, name, ext });
};

export const jsify = (file: string) => {
  return replaceFileExt(file, ".js");
};

export const tsify = (file: string) => {
  return replaceFileExt(file, ".ts");
};

export const jsxify = (file: string) => {
  return replaceFileExt(file, ".jsx");
};

export const tsxify = (file: string) => {
  return replaceFileExt(file, ".tsx");
};

export const isValidUrl = (url: string) => {
  try {
    return new URL(url);
  } catch (_e) {
    return false;
  }
};

export const hashFile = (url: string) => {
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

export const stripTrailingSlash = (url: string) => {
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const resolveFileUrl = (from: string, to: string) => {
  return new URL(toFileUrl(resolve(from, to)).toString());
};

export const cacheBuster = (source: string, timestamp?: number) => {
  return source.replace(
    /\.(j|t)sx?/gi,
    () => {
      return `.js${timestamp ? `?ts=${timestamp}` : ""}`;
    },
  );
};

export const isRemoteSource = (value: string) => {
  return value.startsWith("https://") ||
    value.startsWith("http://");
};

export const isVendorSource = (value: string, vendorDirectory: string) => {
  return value.indexOf(`.ultra/${vendorDirectory}`) >= 0;
};

export const isApiRoute = (value: string) => {
  return value.indexOf(apiDirectory) >= 0;
};
