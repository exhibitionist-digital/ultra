import React from "react";
import ReactDOM from "react-dom/server";
import { Router } from "wouter";
import { HelmetProvider } from "helmet";
import { concat } from "https://deno.land/std@0.107.0/bytes/mod.ts";
import { join } from "https://deno.land/std@0.107.0/path/mod.ts";
import { Buffer } from "https://deno.land/std@0.107.0/io/mod.ts";
import type { Navigate, RenderOptions } from "./types.ts";

const isDev = Deno.env.get("mode") === "dev";
const serverStart = +new Date();

const defaultBufferSize = 8 * 1024;
const defaultChunkSize = 8 * 1024;

const render = async (
  { root, request, importmap, lang, bufferSize, chunkSize }: RenderOptions,
) => {
  chunkSize = chunkSize ?? defaultChunkSize;

  const ts = isDev ? +new Date() : serverStart;
  const app = await import(join(root, `app.js?ts=${ts}`));

  const helmetContext: { helmet: Record<string, number> } = { helmet: {} };
  const cache = new Map();

  // @ts-ignore there's no types for toreadablestream yet
  const body = ReactDOM.renderToReadableStream(
    React.createElement(
      Router,
      { hook: staticLocationHook(request.url.pathname) },
      React.createElement(
        HelmetProvider,
        { context: helmetContext },
        React.createElement(
          app.default,
          { cache },
          null,
        ),
      ),
    ),
  );

  const { helmet } = helmetContext;

  const head = `<!DOCTYPE html><html lang="${lang}"><head>${
    Object.keys(helmet)
      .map((i) => helmet[i].toString())
      .join("")
  }<script type="module" defer>import { createElement } from "${
    importmap.imports["react"]
  }";import { hydrateRoot } from "${
    importmap.imports["react-dom"]
  }";import { Router } from "${
    importmap.imports["wouter"]
  }";import { HelmetProvider } from "${
    importmap.imports["helmet"]
  }";import App from "/app.js";` +
    `const root = hydrateRoot(document.getElementById('ultra'),` +
    `createElement(Router, null, createElement(HelmetProvider, null, createElement(App))))` +
    `</script></head><body><div id="ultra">`;

  const tail = () =>
    `</div></body><script>self.__ultra = ${
      JSON.stringify(Array.from(cache.entries()))
    }</script></html>`;

  // body.getReader() can emit Uint8Arrays() or strings; our chunking expects
  // UTF-8 encoded Uint8Arrays at present, so this stream ensures everything
  // is encoded that way:
  const encodedStream = encodeStream(body);

  const bodyReader = encodedStream.getReader();

  // Buffer the first portion of the response before streaming; this allows
  // us to respond with correct server codes if the component contains errors,
  // but only if those errors occur within the buffered portion:
  const buffer = new Buffer();
  while (buffer.length < (bufferSize ?? defaultBufferSize)) {
    const read = await bodyReader.read();
    if (read.done) break;
    buffer.writeSync(read.value);
  }

  return encodeStream(
    new ReadableStream({
      start(controller) {
        const queue = (part: unknown) =>
          Promise.resolve(controller.enqueue(part));

        queue(head)
          .then(() => queue(buffer.bytes({ copy: false })))
          .then(() => pushBody(bodyReader, controller, chunkSize))
          .catch(async (e) => {
            console.error("readable stream error", e);

            // Might be possible to push something to the client that renders
            // an error if in 'dev mode' here, but the markup that precedes it
            // could very well be broken:
            await queue("Error");
          })
          .then(() => controller.enqueue(tail()))
          .then(() => controller.close());
      },
    }),
  );
};

export default render;

// @ts-ignore fixme: add types
const encodeStream = (readable) =>
  new ReadableStream({
    start(controller) {
      return (async () => {
        const encoder = new TextEncoder();
        const reader = readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            if (typeof value === "string") {
              controller.enqueue(encoder.encode(value));
            } else if (value instanceof Uint8Array) {
              controller.enqueue(value);
            } else {
              throw new TypeError();
            }
          }
        } finally {
          controller.close();
        }
      })();
    },
  });

// @ts-ignore fixme: add types
async function pushBody(reader, controller, chunkSize) {
  let parts = [];
  let partsSize = 0;

  while (true) {
    const read = await reader.read();
    if (read.done) break;
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
    }
  }
  controller.enqueue(concat(...parts));
}

// wouter helper
const staticLocationHook = (path = "/", { record = false } = {}) => {
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
