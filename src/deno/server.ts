import assets from "./../assets.ts";
import { readableStreamFromReader, serve } from "./../deps.ts";
import render from "./../render.ts";

import { APIHandler } from "../types.ts";

const sourceDirectory = Deno.env.get("source") || "src";
const root = Deno.env.get("root") || "http://localhost:8000";
const lang = Deno.env.get("lang") || "en";

const importMap = JSON.parse(Deno.readTextFileSync("importMap.json"));

const deploy = async () => {
  const { raw } = await assets(sourceDirectory);

  const handler = async (request: Request) => {
    const url = new URL(request.url);

    // static files
    if (raw.has(`${sourceDirectory}${url.pathname}`)) {
      const file = await Deno.open(`./${sourceDirectory}${url.pathname}`);
      const body = readableStreamFromReader(file);
      return new Response(body, {
        headers: {
          "content-type": raw.get(`${sourceDirectory}${url.pathname}`),
        },
      });
    }

    // API
    if (url.pathname.startsWith("/api")) {
      const importAPIRoute = async (pathname: string): Promise<APIHandler> => {
        let path = `${sourceDirectory}${pathname}`;
        const js = `${path + ".js"}`;
        const ts = `${path + ".ts"}`;
        if (raw.has(js)) path = `file://${Deno.cwd()}/${js}`;
        else if (raw.has(ts)) path = `file://${Deno.cwd()}/${ts}`;
        const apiHandler: { default: APIHandler } = await import(path);
        return apiHandler.default;
      };
      const pathname = url.pathname.endsWith("/")
        ? url.pathname.slice(0, -1)
        : url.pathname;
      try {
        return (await importAPIRoute(pathname))(request);
      } catch (_error) {
        try {
          return (await importAPIRoute(`${pathname}/index`))(request);
        } catch (_error) {
          return new Response(`Not found`, { status: 404 });
        }
      }
    }

    // let link = await Deno.readTextFile(`./${transpiled}/graph.json`);
    // link = JSON.parse(link);
    return new Response(
      await render({
        url,
        root,
        importMap,
        lang,
      }),
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
          // link,
        },
      },
    );
  };
  return serve(handler);
};

export default deploy;
