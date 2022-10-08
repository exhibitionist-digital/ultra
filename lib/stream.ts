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

export async function streamToString(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  const reader = stream.getReader();
  const textDecoder = new TextDecoder();

  let bufferedString = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      return bufferedString;
    }

    bufferedString += decodeText(value, textDecoder);
  }
}

export function createTransformStream(
  transform: (value: string) => string | Promise<string> = (value) => value,
): TransformStream<Uint8Array, Uint8Array> {
  const textDecoder = new TextDecoder();

  return new TransformStream({
    async transform(chunk, controller) {
      const decoded = decodeText(chunk, textDecoder);
      const transformed = await transform(decoded);
      controller.enqueue(encodeText(transformed));
    },
    flush() {
      textDecoder.decode();
    },
  });
}

export function createInsertedHTMLStream(
  getServerInsertedHTML: () => Promise<string>,
): TransformStream<Uint8Array, Uint8Array> {
  return new TransformStream({
    async transform(chunk, controller) {
      const insertedHTMLChunk = encodeText(await getServerInsertedHTML());

      controller.enqueue(insertedHTMLChunk);
      controller.enqueue(chunk);
    },
  });
}

export function createHeadInjectionTransformStream(
  inject: () => Promise<string>,
): TransformStream<Uint8Array, Uint8Array> {
  let injected = false;
  return new TransformStream({
    async transform(chunk, controller) {
      const content = decodeText(chunk);

      let index;

      const headIndex = content.indexOf("</head");

      if (!injected && (index = headIndex) !== -1) {
        injected = true;
        const injectedContent = content.slice(0, index) + (await inject()) +
          content.slice(index);
        controller.enqueue(encodeText(injectedContent));
      } else {
        controller.enqueue(chunk);
      }
    },
  });
}

export function createImportMapInjectionStream(
  importMap: ImportMap,
  enableEsModuleShims: boolean,
  esModuleShimsPath: string,
) {
  log.debug("Stream inject importMap");
  return createHeadInjectionTransformStream(() => {
    const scripts = [
      `<script type="importmap">${JSON.stringify(importMap)}</script>`,
    ];
    if (enableEsModuleShims) {
      scripts.unshift(
        `<script async src="${esModuleShimsPath}" crossorigin="anonymous"></script>`,
      );
    }
    return Promise.resolve(scripts.join("\n"));
  });
}

export function createInlineDataStream(
  dataStream: ReadableStream<Uint8Array>,
): TransformStream<Uint8Array, Uint8Array> {
  let dataStreamFinished: Promise<void> | null = null;
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk);

      if (!dataStreamFinished) {
        const dataStreamReader = dataStream.getReader();
        dataStreamFinished = new Promise((resolve) => {
          setTimeout(async () => {
            try {
              while (true) {
                const { done, value } = await dataStreamReader.read();
                if (done) {
                  return resolve();
                }
                controller.enqueue(value);
              }
            } catch (error) {
              controller.error(error);
            }
            resolve();
          }, 0);
        });
      }
    },
    flush() {
      if (dataStreamFinished) {
        return dataStreamFinished;
      }
    },
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
  dataStream?: TransformStream<Uint8Array, Uint8Array>;
  importMap?: ImportMap;
  enableEsModuleShims: boolean;
  esModuleShimsPath: string;
  getServerInsertedHTML?: () => Promise<string>;
  serverInsertedHTMLToHead: boolean;
  flushDataStreamHandler?: () => void;
};

export async function continueFromInitialStream(
  renderStream: RenderedReadableStream,
  options: ContinueFromInitialStreamOptions,
): Promise<ReadableStream<Uint8Array>> {
  const {
    importMap,
    enableEsModuleShims,
    esModuleShimsPath,
    generateStaticHTML,
    dataStream,
    getServerInsertedHTML,
    flushDataStreamHandler,
    serverInsertedHTMLToHead,
  } = options;

  log.debug("Continue from initial stream");

  /**
   * @see https://reactjs.org/docs/react-dom-server.html#rendertoreadablestream
   */
  if (generateStaticHTML && typeof renderStream.allReady !== undefined) {
    log.debug(
      "Waiting for stream to complete, generateStaticHTML was requested",
    );
    await renderStream.allReady;
  }

  const transforms: Array<TransformStream<Uint8Array, Uint8Array>> = [
    createTransformStream(),
    /**
     * Inject the provided importMap to the head, before any of the other
     * transform streams below.
     */
    importMap
      ? createImportMapInjectionStream(
        importMap,
        enableEsModuleShims,
        esModuleShimsPath,
      )
      : null,
    /**
     * Enqueue server injected html if serverInsertedHTMLToHead is false
     */
    getServerInsertedHTML && !serverInsertedHTMLToHead
      ? createInsertedHTMLStream(getServerInsertedHTML)
      : null,
    /**
     * Handles useAsync calls
     */
    dataStream ? createInlineDataStream(dataStream.readable) : null,
    /**
     * Insert server injected html to the head if serverInsertedHTMLToHead is true
     */
    createHeadInjectionTransformStream(async () => {
      log.debug("Stream Insert server side html", { serverInsertedHTMLToHead });
      // Insert server side html to end of head in app layout rendering, to avoid
      // hydration errors. Remove this once it's ready to be handled by react itself.
      const serverInsertedHTML =
        getServerInsertedHTML && serverInsertedHTMLToHead
          ? await getServerInsertedHTML()
          : "";

      return serverInsertedHTML;
    }),
  ].filter(nonNullable);

  flushDataStreamHandler && flushDataStreamHandler();

  return transforms.reduce(
    (readable, transform) => readable.pipeThrough(transform),
    renderStream,
  );
}
