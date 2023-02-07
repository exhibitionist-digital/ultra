import { serve } from "https://deno.land/std@0.176.0/http/server.ts";
import { createRouter, createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

/**
 * Create our API router
 */
const api = createRouter();

/**
 * An example API route
 */
api.get("/posts", (context) => {
  return context.json([{
    id: 1,
    title: "Test Post",
  }]);
});

/**
 * Mount the API router to /api
 */
server.route("/api", api);

/**
 * Create our Websocket router
 */
const ws = createRouter();

ws.get("/", (c) => {
  const { response, socket } = Deno.upgradeWebSocket(c.req);

  socket.addEventListener("message", (e) => console.log(e));

  return response;
});

/**
 * Mount the Websocket router to /ws
 */
server.route("/ws", ws);

server.get("*", async (context) => {
  /**
   * Render the request
   */
  const result = await server.render(<App />);

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
