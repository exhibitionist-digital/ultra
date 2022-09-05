/**
 * A lot of this code originally comes from https://github.com/vercel/next.js
 * with some tweaking.
 *
 * node-web-stream-helpers.ts: https://github.com/vercel/next.js/blob/c79b67ccedda1ae6fd9d05cfccf1d2842b94f43f/packages/next/server/node-web-streams-helper.ts
 */
import type { ReactElement } from "react";
import * as ReactDOMServer from "react-dom/server";
import { ImportMap, RenderedReadableStream } from "./types.ts";
import { nonNullable } from "./utils/non-nullable.ts";
import { log } from "./logger.ts";
import { readableStreamFromReader, StringReader } from "./deps.ts";

export function encodeText(input: string) {
  return new TextEncoder().encode(input);
}

export function decodeText(input?: Uint8Array, textDecoder?: TextDecoder) {
  return textDecoder
    ? textDecoder.decode(input, { stream: true })
    : new TextDecoder().decode(input);
}

export function createBufferedTransformStream(
  transform: (value: string) => string | Promise<string> = (value) => value,
): TransformStream<Uint8Array, Uint8Array> {
  let bufferedString = "";
  let pendingFlush: Promise<void> | null = null;

  const flushBuffer = (controller: TransformStreamDefaultController) => {
    if (!pendingFlush) {
      pendingFlush = new Promise((resolve) => {
        setTimeout(async () => {
          const buffered = await transform(bufferedString);
          controller.enqueue(encodeText(buffered));
          bufferedString = "";
          pendingFlush = null;
          resolve();
        }, 0);
      });
    }
    return pendingFlush;
  };

  const textDecoder = new TextDecoder();

  return new TransformStream({
    transform(chunk, controller) {
      bufferedString += decodeText(chunk, textDecoder);
      flushBuffer(controller);
      textDecoder.decode();
    },

    flush() {
      if (pendingFlush) {
        return pendingFlush;
      }
    },
  });
}

export function createFlushEffectStream(
  handleFlushEffect: () => string,
): TransformStream<Uint8Array, Uint8Array> {
  return new TransformStream({
    transform(chunk, controller) {
      const flushedChunk = encodeText(handleFlushEffect());

      controller.enqueue(flushedChunk);
      controller.enqueue(chunk);
    },
  });
}

export function createHeadInjectionTransformStream(
  inject: () => string,
): TransformStream<Uint8Array, Uint8Array> {
  let injected = false;
  return new TransformStream({
    transform(chunk, controller) {
      const content = decodeText(chunk);
      let index;
      const headIndex = content.indexOf("</head");

      if (!injected && (index = headIndex) !== -1) {
        injected = true;
        const injectedContent = content.slice(0, index) + inject() +
          content.slice(index);
        controller.enqueue(encodeText(injectedContent));
      } else {
        controller.enqueue(chunk);
      }
    },
  });
}

export function createImportMapInjectionStream(importMap: ImportMap) {
  log.debug("Stream inject importMap");
  return createHeadInjectionTransformStream(() => {
    return [
      `<script async src="https://ga.jspm.io/npm:es-module-shims@1.5.1/dist/es-module-shims.js" crossorigin="anonymous"></script>`,
      `<script type="importmap">${JSON.stringify(importMap)}</script>`,
    ].join("\n");
  });
}

export function renderToInitialStream({
  element,
  options,
}: {
  element: ReactElement;
  options?: ReactDOMServer.RenderToReadableStreamOptions;
}): Promise<RenderedReadableStream> {
  /**
   * If the ReactDOM implementation doesn't support streams
   * eg Preact, just use renderToString
   */
  if (!ReactDOMServer["renderToReadableStream"]) {
    const reactDomImpl = import.meta.resolve("react-dom/server");
    log.warning(`${reactDomImpl} doesn't support streams`);

    let html = ReactDOMServer.renderToString(element);

    if (options?.bootstrapModules) {
      for (const bootstrapModule of options.bootstrapModules) {
        html =
          `${html}<script src="${bootstrapModule}" type="module" async></script>`;
      }
    }

    return Promise.resolve(readableStreamFromReader(new StringReader(html)));
  }

  log.debug("Render to initial stream");
  return ReactDOMServer.renderToReadableStream(element, options);
}

type ContinueFromInitialStreamOptions = {
  generateStaticHTML: boolean;
  disableHydration: boolean;
  importMap?: ImportMap;
  flushEffectHandler?: () => string;
  flushEffectsToHead: boolean;
};

export async function continueFromInitialStream(
  renderStream: RenderedReadableStream,
  options: ContinueFromInitialStreamOptions,
): Promise<ReadableStream<Uint8Array>> {
  const {
    importMap,
    generateStaticHTML,
    disableHydration,
    flushEffectHandler,
    flushEffectsToHead,
  } = options;

  log.debug("Continue from initial stream");

  /**
   * @see https://reactjs.org/docs/react-dom-server.html#rendertoreadablestream
   */
  if (generateStaticHTML) {
    log.debug(
      "Waiting for stream to complete, generateStaticHTML was requested",
    );
    await renderStream.allReady;
  }

  const transforms: Array<TransformStream<Uint8Array, Uint8Array>> = [
    createBufferedTransformStream(),
    /**
     * Inject the provided importMap to the head, before any of the other
     * transform streams below.
     */
    importMap && disableHydration === false
      ? createImportMapInjectionStream(importMap)
      : null,
    /**
     * Just flush the effects to the queue if flushEffectsToHead is false
     */
    flushEffectHandler && !flushEffectsToHead
      ? createFlushEffectStream(flushEffectHandler)
      : null,
    /**
     * Flush effects to the head if flushEffectsToHead is true
     */
    createHeadInjectionTransformStream(() => {
      log.debug("Stream flush effects", { flushEffectsToHead });
      return flushEffectHandler && flushEffectsToHead
        ? flushEffectHandler()
        : "";
    }),
  ].filter(nonNullable);

  return transforms.reduce(
    (readable, transform) => readable.pipeThrough(transform),
    renderStream,
  );
}
