import type { Context, Next } from "../types.ts";

export async function dev(context: Context, next: Next) {
  if (context.req.headers.get("upgrade") != "websocket") {
    await next();
  } else {
    const { socket: ws, response } = Deno.upgradeWebSocket(context.req);

    globalThis.onmessage = (event) => {
      ws.send(JSON.stringify(event.data));
    };

    return response;
  }
}
