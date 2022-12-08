import { createElement as h } from "react";
import DataStreamContext from "../../hooks/data-stream-context.js";

const dataStreamCallbacks = new Map<string, () => Promise<unknown>>();

export function createFlushDataStreamHandler(
  writer: WritableStreamDefaultWriter<Uint8Array>,
) {
  return function flushDataStreamHandler() {
    const encoder = new TextEncoder();
    const callbacks = Array.from(dataStreamCallbacks.entries());
    return Promise.allSettled(
      callbacks.map(async ([id, callback]) => {
        try {
          const result = await callback();
          writer.write(
            encoder.encode(
              `<script id="${id}" type="application/json">${
                JSON.stringify(result)
              }</script>`,
            ),
          );
        } catch (error) {
          console.error(error);
        }
      }),
    ).then(() => {
      writer.close();
    });
  };
}

function addDataStreamCallback<T>(id: string, callback: () => Promise<T>) {
  dataStreamCallbacks.set(id, callback);
}

export function DataStreamProvider({ children }: { children: JSX.Element }) {
  dataStreamCallbacks.clear();

  return h(
    DataStreamContext.Provider,
    { value: addDataStreamCallback },
    children,
  );
}
