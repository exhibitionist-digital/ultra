import { resolve, toFileUrl } from "../deps.ts";

export function resolveFileUrl(from: string, to: string) {
  return new URL(toFileUrl(resolve(from, to)).toString());
}
