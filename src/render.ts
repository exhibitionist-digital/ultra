import { extname } from "./deps.ts";
import React from "react";
import ReactDOM from "react-dom/server";
import App from "app";
import { BaseLocationHook, Router } from "wouter";
import { HelmetProvider } from "react-helmet";
import { isDev, sourceDirectory, wsport } from "./env.ts";
import type { ImportMap, Navigate, RenderOptions } from "./types.ts";
import { ImportMapResolver } from "./importMapResolver.ts";
import { encodeStream, pushBody } from "./stream.ts";

// Size of the chunk to emit to the connection as the response streams:
const defaultChunkSize = 8 * 1024;

const requiredDependencies = [
  "react",
  "react-dom",
  "wouter",
  "react-helmet",
  "app",
] as const;

const render = async (
  {
    url,
    root,
    importMap,
    lang = "en",
    disableStreaming = false,
  }: RenderOptions,
) => {
  const chunkSize = defaultChunkSize;

  const renderMap: ImportMap = { imports: {} };
  Object.keys(importMap.imports)?.forEach((k) => {
    const im: string = importMap.imports[k];
    if (im.indexOf("http") < 0) {
      renderMap.imports[k] = `./${im.replace("./.ultra/", "")}`;
    } else {
      renderMap.imports[k] = im;
    }
  });

  const importMapResolver = new ImportMapResolver(
    renderMap,
    new URL(sourceDirectory, root),
  );

  const dependencyMap = importMapResolver.getDependencyMap(
    requiredDependencies,
  );

  const resolvedAppImportUrl = new URL(dependencyMap.get("app")!);

  const transpiledAppImportUrl = new URL(
    `${resolvedAppImportUrl.origin}/${
      resolvedAppImportUrl.pathname.replace(`/${sourceDirectory}/`, "")
    }`.replace(
      extname(resolvedAppImportUrl.pathname),
      ".js",
    ),
  );

  // kickstart caches for react-helmet and swr
  const helmetContext: { helmet: Record<string, number> } = { helmet: {} };
  const cache = new Map();

  // this uses the new promisied react stream render available in rc.1
  const controller = new AbortController();
  let body;

  try {
    // @ts-ignore fix react stream types
    body = await ReactDOM.renderToReadableStream(
      React.createElement(
        Router,
        { hook: staticLocationHook(url.pathname), children: null },
        React.createElement(
          HelmetProvider,
          { context: helmetContext },
          React.createElement(
            App,
            { cache },
            null,
          ),
        ),
      ),
      // @ts-ignore fix react stream types
      {
        signal: controller.signal,
      },
    );
  } catch (error) {
    console.log({ error });
    body = new ReadableStream({
      start(controller) {
        const chunk = new TextEncoder().encode(error);
        controller.enqueue(chunk);
        controller.close();
      },
    });
  }

  // head builder
  const renderHead = () => {
    const { helmet } = helmetContext;
    const head =
      `<!DOCTYPE html><html lang="${lang}"><head>${
        Object.keys(helmet)
          .map((i) => helmet[i].toString())
          .join("")
      }<script type="module" defer>${
        isDev ? socket(root) : ""
      }import { createElement } from "${
        dependencyMap.get("react")
      }";import { hydrateRoot } from "${
        dependencyMap.get("react-dom")
      }";import { Router } from "${
        dependencyMap.get("wouter")
      }";import { HelmetProvider } from "${
        dependencyMap.get("react-helmet")
      }";import App from "${transpiledAppImportUrl}";` +
      `const root = hydrateRoot(document.getElementById("ultra"),` +
      `createElement(Router, null, createElement(HelmetProvider, null, createElement(App))))` +
      `</script></head><body><div id="ultra">`;
    return head;
  };

  // tail builder
  const renderTail = () => {
    return `</div></body><script>self.__ultra = ${
      JSON.stringify(Array.from(cache.entries()))
    }</script></html>`;
  };

  // body.getReader() can emit Uint8Arrays() or strings; our chunking expects
  // UTF-8 encoded Uint8Arrays at present, so this stream ensures everything
  // is encoded that way:
  const encodedStream = encodeStream(body);
  const bodyReader = encodedStream.getReader();

  // if streaming is disabled, here is a renderToString equiv
  if (disableStreaming) {
    const renderToString = async () => {
      const html = await new Response(
        encodeStream(
          new ReadableStream({
            start(controller) {
              Promise.resolve()
                .then(() => pushBody(bodyReader, controller, chunkSize))
                .then(() => controller.close());
            },
          }),
        ),
      )
        .text();
      return (renderHead() + html + renderTail());
    };

    return await renderToString();
  }

  return encodeStream(
    new ReadableStream({
      start(controller) {
        const queue = (part: string | Uint8Array) => {
          return Promise.resolve(controller.enqueue(part));
        };

        queue(renderHead())
          .then(() => pushBody(bodyReader, controller, chunkSize))
          .then(() => queue(renderTail()))
          .then(() => controller.close());
      },
    }),
  );
};

export default render;

// wouter helper
const staticLocationHook = (
  path = "/",
  { record = false } = {},
): BaseLocationHook => {
  // deno-lint-ignore prefer-const
  let hook: { history?: string[] } & (() => [string, Navigate]);

  const navigate: Navigate = (to, { replace } = {}) => {
    if (record) {
      if (replace) {
        hook.history?.pop();
      }
      hook.history?.push(to);
    }
  };
  hook = () => [path, navigate];
  hook.history = [path];
  return hook;
};

const socket = (root: string) => {
  const url = new URL(root);

  return `
    const _ultra_socket = new WebSocket("ws://${url.hostname}:${wsport}");
    _ultra_socket.addEventListener("message", (e) => {
      if (e.data === "reload") {
        location.reload();
      }
    });
  `;
};
