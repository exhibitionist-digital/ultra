import { existsSync } from "https://deno.land/std@0.107.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.107.0/path/mod.ts";
import LRU from "https://deno.land/x/lru@1.0.2/mod.ts";
import {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v9.0.0/mod.ts";
import render from "./render.ts";
import transform from "./transform.ts";
import type { ImportMap, StartOptions } from "./types.ts";

const app = new Application();
const router = new Router();
const memory = new LRU<string>(500);

const isDev = Deno.env.get("mode") === "dev";
const port = parseInt(Deno.env.get("port") || "", 10) || 3000;
const root = Deno.env.get("url") || `http://localhost:${port}`;

const start = ({ importmap: importMapSource, lang = "en" }: StartOptions) => {
  const importmap: ImportMap = JSON.parse(importMapSource);

  app.use(async (context, next) => {
    const { pathname } = context.request.url;
    if (pathname == "/") await next();
    try {
      await send(context, pathname, {
        root: join(Deno.cwd(), "src"),
      });
    } catch (_e) {
      await next();
    }
  });

  router.get("/:slug+.js", async (context, next) => {
    const { pathname } = context.request.url;
    if (memory.has(pathname) && !isDev) {
      context.response.type = "application/javascript";
      context.response.body = memory.get(pathname);
      return;
    }
    const jsx = pathname.replaceAll(".js", ".jsx");
    const tsx = pathname.replaceAll(".js", ".tsx");
    // deno-lint-ignore prefer-const
    let file = existsSync(join(Deno.cwd(), "src", jsx))
      ? jsx
      : existsSync(join(Deno.cwd(), "src", tsx))
      ? tsx
      : false;
    if (!file) return await next();
    try {
      const source = await Deno.readTextFile(
        join(Deno.cwd(), "src", ...file.split("/")),
      );
      const code = await transform({ source, importmap, root });
      if (!isDev) memory.set(pathname, code);
      context.response.type = "application/javascript";
      context.response.body = code;
    } catch (e) {
      console.log(e);
    }
  });

  router.get("/(.*)", async (context) => {
    try {
      context.response.body = await render({
        root,
        request: context.request,
        importmap,
        lang,
      });
    } catch (e) {
      console.log(e);
      context.throw(500);
    }
  });

  app.use(router.routes());

  app.use(router.allowedMethods());

  app.addEventListener("listen", () => {
    console.log(`Listening: ${root}`);
  });

  app.addEventListener("error", (evt) => {
    console.log(evt.error);
  });

  app.listen({ port });
};

export default start;

export { app, router };
