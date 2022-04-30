import { concat, readAll, readerFromStreamReader } from "./deps.ts";

export function isReadableStream(value: unknown): value is ReadableStream {
  return value instanceof ReadableStream;
}

export function readAllFromReadableStream(readableStream: ReadableStream) {
  return readAll(readerFromStreamReader(readableStream.getReader()));
}

export function encodeStream(readable: ReadableStream<string | Uint8Array>) {
  return new ReadableStream({
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
}

export async function pushBody(
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
