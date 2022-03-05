import { concat, join } from "./deps.ts";
import React from "react";
import ReactDOM from "react-dom/server";
import { BaseLocationHook, Router } from "wouter";
import { HelmetProvider } from "react-helmet";
import app from "app";
import { isDev } from "./env.ts";
import type { Navigate, RenderOptions } from "./types.ts";

// FIXME: these react types are wrong now
// renderToReadableStream not available yet in official types
// declare global {
//   namespace ReactDOMServer {
//     export const renderToReadableStream: (
//       element: ReactElement,
//     ) => ReadableStream<string | Uint8Array>;
//   }
// }

// Size of the chunk to emit to the connection as the response streams:
const defaultChunkSize = 8 * 1024;

const render = async (
  {
    url,
    root,
    importmap,
    lang = "en",
    cacheBuster,
    streaming = true,
  }: RenderOptions,
) => {
  const chunkSize = defaultChunkSize;
  // in dev we can dynamically import that app component
  // in prod we use the import at the top of this file
  // this is so changes to app can be seen in real time in dev
  let importedApp;
  if (cacheBuster && isDev) {
    importedApp = await import(join(root, `app.js?ts=${cacheBuster}`));
  }

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
            importedApp?.default || app,
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
    console.error(error);
    body = "<h1>Ultra error</h1>";
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
        isDev && socket(root)
      }import { createElement } from "${
        importmap.imports["react"]
      }";import { hydrateRoot } from "${
        importmap.imports["react-dom"]
      }";import { Router } from "${
        importmap.imports["wouter"]
      }";import { HelmetProvider } from "${
        importmap.imports["react-helmet"]
      }";import App from "/app.js";` +
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
  if (!streaming) {
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

const encodeStream = (readable: ReadableStream<string | Uint8Array>) =>
  new ReadableStream({
    start(controller) {
      return (async () => {
        const encoder = new TextEncoder();
        const reader = readable.getReader();
        try {
          while (true) {
            const read = await reader.read();
            if (read.done) break;

            if (typeof read.value === "string") {
              controller.enqueue(encoder.encode(read.value));
            } else if (read.value instanceof Uint8Array) {
              controller.enqueue(read.value);
            } else {
              return undefined;
            }
          }
        } finally {
          controller.close();
        }
      })();
    },
  });

async function pushBody(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  controller: ReadableStreamDefaultController<Uint8Array>,
  chunkSize: number,
) {
  const chunkFlushTimeoutMs = 1;
  let parts = [] as Uint8Array[];
  let partsSize = 0;

  let idleTimeout = 0;
  const idleFlush = () => {
    const write = concat(...parts);
    parts = [];
    partsSize = 0;
    controller.enqueue(write);
  };

  while (true) {
    const read = await reader.read();
    if (read.done) {
      break;
    }
    partsSize += read.value.length;
    parts.push(read.value);
    if (partsSize >= chunkSize) {
      const write = concat(...parts);
      parts = [];
      partsSize = 0;
      if (write.length > chunkSize) {
        parts.push(write.slice(chunkSize));
      }
      controller.enqueue(write.slice(0, chunkSize));
    } else {
      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = setTimeout(idleFlush, chunkFlushTimeoutMs);
    }
  }
  if (idleTimeout) clearTimeout(idleTimeout);
  controller.enqueue(concat(...parts));
}

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
    const _ultra_socket = new WebSocket("ws://${url.host}/_ultra_socket");
    _ultra_socket.addEventListener("message", (e) => {
      if (e.data === "reload") {
        location.reload();
      }
    });
  `;
};
