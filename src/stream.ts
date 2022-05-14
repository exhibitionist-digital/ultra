import type { ReactNode } from "react";
import { renderToReadableStream } from "react-dom/server";
import { assert } from "./react/utils.ts";

type RenderToStreamOptions = {
  disable?: boolean;
  bootstrapModules: string[];
  onBoundaryError?: (err: unknown) => void;
};

export async function renderToStream(
  element: ReactNode,
  { disable, bootstrapModules, onBoundaryError }: RenderToStreamOptions,
) {
  let didError = false;
  let firstErr: unknown = null;
  let reactBug: unknown = null;

  const onError = (err: unknown) => {
    didError = true;
    firstErr = firstErr || err;
    afterReactBugCatch(() => {
      // Is not a React internal error (i.e. a React bug)
      if (err !== reactBug) {
        onBoundaryError?.(err);
      }
    });
  };

  const readableOriginal = await renderToReadableStream(element, {
    onError,
    bootstrapModules,
  });

  const { allReady } = readableOriginal;

  let promiseResolved = false;

  // Upon React internal errors (i.e. React bugs), React rejects `allReady`.
  // React doesn't reject `allReady` upon boundary errors.
  allReady.catch((err) => {
    didError = true;
    firstErr = firstErr || err;
    reactBug = err;
    // Only log if it wasn't used as rejection for `await renderToStream()`
    if (reactBug !== firstErr || promiseResolved) {
      console.error(reactBug);
    }
  });

  if (didError) throw firstErr;
  if (disable) await allReady;
  if (didError) throw firstErr;

  const { readableWrapper, streamEnd, injectToStream } = createReadableWrapper(
    readableOriginal,
  );

  promiseResolved = true;

  return {
    readable: readableWrapper,
    streamEnd: wrapStreamEnd(streamEnd, didError),
    injectToStream,
  };
}

function afterReactBugCatch(fn: () => void) {
  setTimeout(() => {
    fn();
  }, 0);
}

function wrapStreamEnd(
  streamEnd: Promise<void>,
  didError: boolean,
): Promise<boolean> {
  return (
    streamEnd
      // Needed because of the `afterReactBugCatch()` hack above, otherwise `onBoundaryError` triggers after `streamEnd` resolved
      .then(() => new Promise<void>((r) => setTimeout(r, 0)))
      .then(() => !didError)
  );
}

function createReadableWrapper(readableOriginal: ReadableStream) {
  const bufferParams: {
    writeChunk: null | ((_chunk: string) => void);
  } = {
    writeChunk: null,
  };

  // deno-lint-ignore no-explicit-any
  let controllerWrapper: ReadableStreamDefaultController<any>;
  let onEnded!: () => void;

  const streamEnd = new Promise<void>((r) => {
    onEnded = () => r();
  });

  const readableWrapper = new ReadableStream({
    start(controller) {
      controllerWrapper = controller;
      onReady(onEnded);
    },
  });

  const { injectToStream, onBeforeWrite, onBeforeEnd } = createBuffer(
    bufferParams,
  );

  async function onReady(onEnded: () => void) {
    const writeChunk = (bufferParams.writeChunk = (chunk: unknown) => {
      controllerWrapper.enqueue(encodeForStream(chunk));
    });

    const reader = readableOriginal.getReader();

    while (true) {
      // deno-lint-ignore no-explicit-any
      let result: ReadableStreamDefaultReadResult<any>;
      try {
        result = await reader.read();
      } catch (err) {
        controllerWrapper.close();
        throw err;
      }
      const { value, done } = result;
      if (done) {
        break;
      }
      onBeforeWrite();
      writeChunk(value);
    }

    // Collect `injectToStream()` calls stuck in an async call
    setTimeout(() => {
      onBeforeEnd();
      controllerWrapper.close();
      onEnded();
    }, 0);
  }

  return { readableWrapper, streamEnd, injectToStream };
}

let encoder: TextEncoder;

function encodeForStream(thing: unknown) {
  if (!encoder) {
    encoder = new TextEncoder();
  }
  if (typeof thing === "string") {
    return encoder.encode(thing);
  }
  return thing;
}

function createBuffer(
  bufferParams: { writeChunk: null | ((_chunk: string) => void) },
) {
  const buffer: string[] = [];
  let state: "UNSTARTED" | "STREAMING" | "ENDED" = "UNSTARTED";
  let writePermission: null | boolean = null; // Set to `null` because React fails to hydrate if something is injected before the first react write

  function injectToStream(chunk: string) {
    buffer.push(chunk);
    flushBuffer();
  }

  function flushBuffer() {
    if (!writePermission) {
      return;
    }
    if (buffer.length === 0) {
      return;
    }
    if (state !== "STREAMING") {
      return;
    }
    buffer.forEach((chunk) => {
      const { writeChunk } = bufferParams;
      assert(writeChunk);
      writeChunk(chunk);
    });
    buffer.length = 0;
  }

  function onBeforeWrite() {
    state === "UNSTARTED";
    state = "STREAMING";
    if (writePermission) {
      flushBuffer();
    }
    if (writePermission == true || writePermission === null) {
      writePermission = false;
      setTimeout(() => {
        writePermission = true;
        flushBuffer();
      });
    }
  }

  function onBeforeEnd() {
    writePermission = true;
    flushBuffer();
    state = "ENDED";
  }

  return { injectToStream, onBeforeWrite, onBeforeEnd };
}
