import type { Context, Next } from "../types.ts";

export async function dev(context: Context, next: Next) {
  if (context.req.headers.get("upgrade") != "websocket") {
    await next();
  } else {
    const { socket: ws, response } = Deno.upgradeWebSocket(context.req);

    globalThis.onmessage = async (event) => {
      const data: { type: string; paths: string[] } = event.data;
      for (const path of data.paths) {
        console.log("import", path);
        await import(path);
      }
      console.log("websocket send");
      ws.send(JSON.stringify(data));
    };

    return response;
  }
}
