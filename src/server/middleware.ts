import assets from "../assets.ts";
import render from "../render.ts";
import transform from "../transform.ts";
import { Context, Middleware, Next } from "../types.ts";
import { LRU, readableStreamFromReader } from "../deps.ts";
import { createURL } from "./request.ts";
import {
  disableStreaming,
  isDev,
  lang,
  sourceDirectory,
  vendorDirectory,
} from "../env.ts";
import {
  replaceFileExt,
  resolveFileUrl,
  ValidExtensions,
} from "../resolver.ts";
import { resolveConfig, resolveImportMap } from "../config.ts";

const memory = new LRU<string>(500);
const [
  rawAssets,
  vendorAssets,
  importMap,
] = await Promise.all([
  assets(sourceDirectory),
  assets(`.ultra/${vendorDirectory}`),
  (async () => {
    const cwd = Deno.cwd();
    const config = await resolveConfig(cwd);
    const importMap = await resolveImportMap(cwd, config);
    return importMap;
  })(),
]);

export function dispatch<C extends Context = Context>(
  middlewares: Middleware<C>[],
  context: C,
  index = 0,
): Next {
  const nextMiddlewareFunction = middlewares[index];
  return nextMiddlewareFunction
    ? async (shortCircuit?: boolean) => {
      if (shortCircuit) {
        return;
      }

      await nextMiddlewareFunction(
        context,
        dispatch(middlewares, context, index + 1),
      );
    }
    : async () => {};
}

export function compose<C extends Context = Context>(
  ...middlewares: Middleware<C>[]
): Middleware<C> {
  return async function composedMiddleware(
    context: C,
    next: Next,
  ) {
    await dispatch(middlewares, context)();
    await next();
  };
}

export const renderPage: Middleware = async (context, next) => {
  const url = createURL(context.request);

  const body = await render({
    url,
    importMap,
    lang,
    disableStreaming,
  });

  context.response.body = body;
  context.response.headers = {
    ...context.response.headers,
    "content-type": "text/html; charset=utf-8",
  };

  await next(true);
};

export const staticAsset: Middleware = async ({ request, response }, next) => {
  const url = createURL(request);

  const filePath = `${sourceDirectory}${url.pathname}`;
  if (!rawAssets.raw.has(filePath)) {
    await next();
    return;
  }

  const contentType = rawAssets.raw.get(filePath);
  if (!contentType) {
    response.status = 415;
    response.statusText = "Unsupported Media Type";

    await next(true);
    return;
  }

  response.body = readableStreamFromReader(await Deno.open(`./${filePath}`));
  response.headers = {
    ...response.headers,
    "content-type": contentType,
  };

  await next(true);
};

export const transpileSource: Middleware = async (context, next) => {
  const url = createURL(context.request);

  const transpilation = async (file: string) => {
    let js = memory.get(url.pathname);

    if (!js) {
      const source = await Deno.readTextFile(
        resolveFileUrl(Deno.cwd(), file),
      );
      const t0 = performance.now();

      js = await transform({
        source,
        sourceUrl: url,
        importMap,
      });

      const t1 = performance.now();
      const duration = (t1 - t0).toFixed(2);

      console.log(`Transpile ${file} in ${duration}ms`);

      if (!isDev) {
        memory.set(url.pathname, js);
      }
    }

    return js;
  };

  const fileTypes: ValidExtensions[] = [".jsx", ".tsx", ".ts"];
  for (const fileType of fileTypes) {
    const filePath = `${sourceDirectory}${
      replaceFileExt(url.pathname, fileType)
    }`;
    if (rawAssets.transpile.has(filePath)) {
      context.response.body = await transpilation(filePath);
      context.response.headers = {
        ...context.response.headers,
        "content-type": "application/javascript",
      };
      await next(true);
      return;
    }
  }

  await next();
};

export const vendorMap: Middleware = async ({ request, response }, next) => {
  const url = createURL(request);

  if (!vendorAssets.raw.has(`.ultra${url.pathname}`)) {
    await next();
    return;
  }

  const file = await Deno.open(`./.ultra${url.pathname}`);
  const body = readableStreamFromReader(file);

  response.body = body;
  response.headers = {
    ...response.headers,
    "content-type": "application/javascript",
  };

  await next(true);
};

export const requestHandler: Middleware = compose(
  transpileSource,
  staticAsset,
  vendorMap,
  renderPage,
);
