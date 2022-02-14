export const isDev = Deno.env.get("mode") === "dev";
export const port = Deno.env.get("port") || 8000;
