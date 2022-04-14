const apiDirectory = Deno.env.get("api") || "src/api";

export function isApiRoute(value: string) {
  return value.indexOf(apiDirectory) >= 0;
}
