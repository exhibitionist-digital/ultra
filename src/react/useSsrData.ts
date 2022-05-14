import { createContext, createElement, ReactNode, useContext } from "react";
import { useStream } from "./useStream.ts";
import { assert, isClientSide, isServerSide } from "./utils.ts";
import { parse, stringify } from "https://esm.sh/@brillout/json-s";

/**
 * All of this has been taken from {@link https://github.com/brillout/react-streaming}
 * and modified to work within Deno
 *
 * If we can get a Deno native module {@link https://github.com/brillout/react-streaming/issues/3}
 * we should be able to just use it as a dependency
 */

// deno-lint-ignore no-explicit-any
const Context = createContext<Data>(undefined as any);

type Data = Record<string, Entry>;

type Entry =
  | { state: "pending"; promise: Promise<unknown> }
  | { state: "error"; error: unknown }
  | { state: "done"; value: unknown };

export function SsrDataProvider({ children }: { children: ReactNode }) {
  const data = {};
  return createElement(Context.Provider, { value: data }, children);
}

type SsrData = { key: string; value: unknown };
const className = "react-streaming_ssr-data";

function getHtmlChunk(entry: SsrData): string {
  const ssrData = [entry];
  const htmlChunk = `<script class="${className}" type="application/json">${
    stringify(ssrData)
  }</script>`;
  return htmlChunk;
}

export function getSsrData(
  key: string,
): { isAvailable: true; value: unknown } | { isAvailable: false } {
  const els = Array.from(window.document.querySelectorAll(`.${className}`));
  for (const el of els) {
    assert(el.textContent);
    const data = parse(el.textContent) as SsrData[];
    for (const entry of data) {
      assert(typeof entry.key === "string");
      if (entry.key === key) {
        const { value } = entry;
        return { isAvailable: true, value };
      }
    }
  }
  return { isAvailable: false };
}

export function useSsrData<T>(key: string, asyncFn: () => Promise<T>): T {
  if (isClientSide()) {
    const ssrData = getSsrData(key);
    if (ssrData.isAvailable) {
      return ssrData.value as T;
    }
  }

  const data = useContext(Context);
  let entry = data[key];

  if (!entry) {
    const streamUtils = useStream();
    const promise = (async () => {
      let value: unknown;
      try {
        value = await asyncFn();
      } catch (error) {
        // React seems buggy around error handling; we handle errors ourselves
        entry = data[key] = { state: "error", error };
        return;
      }
      entry = data[key] = { state: "done", value };
      if (isServerSide()) {
        assert(streamUtils);
        streamUtils.injectToStream(getHtmlChunk({ key, value }));
      }
    })();
    entry = data[key] = { state: "pending", promise };
  }

  if (entry.state === "pending") {
    throw entry.promise;
  }

  if (entry.state === "error") {
    throw entry.error;
  }

  if (entry.state === "done") {
    return entry.value as T;
  }

  assert(false);
}
