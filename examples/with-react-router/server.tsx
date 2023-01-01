import { serve } from "https://deno.land/std@0.164.0/http/server.ts";
import { createRouter, createServer } from "ultra/server.ts";
import {
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
import { routes } from "./src/routes.tsx";
import App from "./src/app.tsx";
import { createStaticHandler } from "@remix-run/router";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

export type Note = {
  id: number;
  title: string;
  content: string;
};

const noteRouter = createRouter();
const notes: Note[] = [
  {
    id: 1,
    title: "Note 1",
    content: "This is note 1",
  },
];

noteRouter.get("/all", (context) => {
  return context.json(notes, 200);
});

noteRouter.get("/get/:id", (context) => {
  const note = notes.find(
    (note) => note.id === Number(context.req.param("id")),
  );
  return context.json(note, 200);
});

noteRouter.post("/create", async (context) => {
  const data = await context.req.formData();
  const title = data.get("title") as string;
  const content = data.get("content") as string;
  const id = notes.length + 1;
  notes.push({ id, title, content });
  return context.json({ id });
});

noteRouter.post("/delete", async (context) => {
  const id = (await context.req.formData()).get("id") as string;
  const note = notes.find((note) => note.id.toString() === id);
  notes.splice(notes.indexOf(note!), 1);
  return context.redirect("/", 303);
});

server.route("/notes", noteRouter);

server.all("*", async (context) => {
  const { query } = createStaticHandler(routes);
  const remixRequest = createFetchRequest(context.req);
  const remixContext = await query(remixRequest);

  if (remixContext instanceof Response) {
    throw remixContext;
  }
  const router = createStaticRouter(routes, remixContext);
  const result = await server.renderWithContext(
    <App>
      <StaticRouterProvider context={remixContext} router={router} />
    </App>,
    context,
  );
  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});

if (import.meta.main) {
  serve(server.fetch);
}

export default server;

export function createFetchHeaders(
  requestHeaders: Request["headers"],
): Headers {
  const headers = new Headers();

  for (const [key, values] of Object.entries(requestHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  return headers;
}

export function createFetchRequest(req: Request): Request {
  const url = new URL(req.url);

  const init: RequestInit = {
    method: req.method,
    headers: createFetchHeaders(req.headers),
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }

  return new Request(url.href, init);
}
