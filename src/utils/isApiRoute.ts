import { apiDirectory } from "../env.ts";

export function isApiRoute(value: string) {
  return value.indexOf(apiDirectory) >= 0;
}
