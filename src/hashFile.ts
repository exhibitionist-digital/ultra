import { basename, crypto } from "./deps.ts";

export const hashFile = (url: string): string => {
  // strip query params from hashing
  url = url.split("?")[0];
  const filename = basename(url);
  const msgUint8 = new TextEncoder().encode(url);
  const hashBuffer = crypto.subtle.digestSync("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

  const smallHash = hash.substring(0, 16);
  const result = `${filename}.${smallHash}`;

  return result;
};
